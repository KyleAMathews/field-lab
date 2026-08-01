import { type AnyStateMachine, createActor, createMachine } from "xstate";

const fieldLogMachine = createMachine({
	id: "fieldLog",
	initial: "missing",
	states: {
		missing: { on: { "trip.created": "open" } },
		open: {
			on: {
				"trip.context.recorded": "open",
				"comment.recorded": "open",
				"note.recorded": "open",
				"synthesis.recorded": "open",
				"engine.result.recorded": "open",
			},
		},
	},
});

const sourceMachine = createMachine({
	id: "source",
	initial: "missing",
	states: {
		missing: { on: { "source.collected": "collected" } },
		collected: {
			on: {
				"source.examined": "collected",
				"source.publication.authorized": "collected",
			},
		},
	},
});

const instrumentRunMachine = createMachine({
	id: "instrumentRun",
	initial: "missing",
	states: {
		missing: { on: { "instrument.run.selected": "selected" } },
		selected: {
			on: {
				"instrument.run.prepared": "prepared",
				"instrument.run.started": "running",
				"instrument.run.completed": "completed",
				"instrument.run.failed": "failed",
				"instrument.run.stopped": "stopped",
				"instrument.feedback.recorded": "selected",
			},
		},
		prepared: {
			on: {
				"instrument.run.started": "running",
				"instrument.run.completed": "completed",
				"instrument.run.failed": "failed",
				"instrument.run.stopped": "stopped",
				"instrument.feedback.recorded": "prepared",
			},
		},
		running: {
			on: {
				"instrument.run.completed": "completed",
				"instrument.run.failed": "failed",
				"instrument.run.stopped": "stopped",
				"instrument.feedback.recorded": "running",
			},
		},
		completed: { on: { "instrument.feedback.recorded": "completed" } },
		failed: { on: { "instrument.feedback.recorded": "failed" } },
		stopped: { on: { "instrument.feedback.recorded": "stopped" } },
	},
});

const questionMachine = createMachine({
	id: "question",
	initial: "missing",
	states: {
		missing: { on: { "question.added": "open" } },
		open: {
			on: {
				"question.revised": "open",
				"question.answered": "answered",
				"question.removed": "removed",
			},
		},
		answered: {
			on: {
				"question.revised": "answered",
				"question.reopened": "open",
				"question.removed": "removed",
			},
		},
		removed: {},
	},
});

const termMachine = createMachine({
	id: "term",
	initial: "missing",
	states: {
		missing: { on: { "term.added": "active" } },
		active: {
			on: {
				"term.revised": "active",
				"term.removed": "removed",
			},
		},
		removed: {},
	},
});

const tensionMachine = createMachine({
	id: "tension",
	initial: "missing",
	states: {
		missing: { on: { "tension.added": "live" } },
		live: {
			on: {
				"tension.revised": "live",
				"tension.resolved": "resolved",
				"tension.removed": "removed",
			},
		},
		resolved: {
			on: {
				"tension.revised": "resolved",
				"tension.reopened": "live",
				"tension.removed": "removed",
			},
		},
		removed: {},
	},
});

const planItemMachine = createMachine({
	id: "planItem",
	initial: "missing",
	states: {
		missing: { on: { "plan.item.added": "open" } },
		open: {
			on: {
				"plan.item.moved": "open",
				"plan.item.completed": "completed",
				"plan.item.removed": "removed",
			},
		},
		completed: {
			on: {
				"plan.item.moved": "completed",
				"plan.item.removed": "removed",
			},
		},
		removed: {},
	},
});

const workflowMachine = createMachine({
	id: "workflow",
	initial: "missing",
	states: {
		missing: { on: { "workflow.selected": "selected" } },
		selected: {
			on: {
				"workflow.started": "running",
				"workflow.failed": "failed",
			},
		},
		running: {
			on: {
				"workflow.paused": "paused",
				"workflow.completed": "completed",
				"workflow.failed": "failed",
			},
		},
		paused: {
			on: {
				"workflow.resumed": "running",
				"workflow.failed": "failed",
			},
		},
		completed: {},
		failed: {},
	},
});

export interface TransitionEvent {
	type: string;
	payload: Record<string, unknown>;
}

function numericId(
	payload: Record<string, unknown>,
	key: string,
	type: string,
): number {
	const value = payload[key];
	if (!Number.isInteger(value) || Number(value) < 1)
		throw new Error(`${type} requires a positive ${key}.`);
	return Number(value);
}

function routing(event: TransitionEvent): {
	key: string;
	machine: AnyStateMachine;
} {
	const { type, payload } = event;
	if (
		type.startsWith("trip.") ||
		type === "comment.recorded" ||
		type === "note.recorded" ||
		type === "synthesis.recorded" ||
		type === "engine.result.recorded"
	)
		return { key: "trip", machine: fieldLogMachine };
	if (type.startsWith("source."))
		return {
			key: `source:${numericId(payload, "sourceId", type)}`,
			machine: sourceMachine,
		};
	if (type.startsWith("instrument."))
		return {
			key: `run:${numericId(payload, "runId", type)}`,
			machine: instrumentRunMachine,
		};
	if (type.startsWith("question."))
		return {
			key: `question:${numericId(payload, "questionId", type)}`,
			machine: questionMachine,
		};
	if (type.startsWith("term."))
		return {
			key: `term:${numericId(payload, "termId", type)}`,
			machine: termMachine,
		};
	if (type.startsWith("tension."))
		return {
			key: `tension:${numericId(payload, "tensionId", type)}`,
			machine: tensionMachine,
		};
	if (type.startsWith("plan.item."))
		return {
			key: `plan:${numericId(payload, "planItemId", type)}`,
			machine: planItemMachine,
		};
	if (type.startsWith("workflow."))
		return {
			key: `workflow:${numericId(payload, "workflowId", type)}`,
			machine: workflowMachine,
		};
	throw new Error(`Unsupported event type: ${type}.`);
}

export function validateTransitions(events: TransitionEvent[]): void {
	const actors = new Map<string, ReturnType<typeof createActor>>();
	try {
		for (const event of events) {
			const route = routing(event);
			let actor = actors.get(route.key);
			if (!actor) {
				actor = createActor(route.machine).start();
				actors.set(route.key, actor);
			}
			const xstateEvent = { type: event.type };
			if (!actor.getSnapshot().can(xstateEvent)) {
				throw new Error(
					`Illegal transition for ${route.key}: ${String(
						actor.getSnapshot().value,
					)} → ${event.type}.`,
				);
			}
			actor.send(xstateEvent);
		}
	} finally {
		for (const actor of actors.values()) actor.stop();
	}
}
