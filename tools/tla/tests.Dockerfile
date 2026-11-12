ARG TLC_IMAGE=field-lab-tlc:local
FROM ${TLC_IMAGE}

# Upstream signal tests use `ps -o ppid= -p PID`; BusyBox ps lacks -p.
# Keep this test-only dependency out of the runtime image.
RUN apk add --no-cache procps
