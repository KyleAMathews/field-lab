FROM node:24.19.0-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS statechart-runtime

FROM eclipse-temurin:21-jre-alpine@sha256:1a29e1fe337eb28b5bec30f0ee8ed29f0ff80ab6f75dcf9313efe82911065a52

ARG TLA2TOOLS_VERSION=v1.7.4
ARG TLA2TOOLS_SHA256=936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88

RUN mkdir -p /opt/tla \
    && wget -q -O /opt/tla/tla2tools.jar \
      "https://github.com/tlaplus/tlaplus/releases/download/${TLA2TOOLS_VERSION}/tla2tools.jar" \
    && echo "${TLA2TOOLS_SHA256}  /opt/tla/tla2tools.jar" | sha256sum -c -

COPY --from=statechart-runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=statechart-runtime /usr/lib/libstdc++.so.6* /usr/lib/
COPY --from=statechart-runtime /usr/lib/libgcc_s.so.1 /usr/lib/
COPY statechart /opt/field-lab/statechart
ENV TLA2TOOLS=/opt/tla/tla2tools.jar

WORKDIR /work

ENTRYPOINT ["java", "-XX:+UseParallelGC", "-cp", "/opt/tla/tla2tools.jar", "tlc2.TLC"]
