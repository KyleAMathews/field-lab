FROM eclipse-temurin:21-jre-alpine@sha256:1a29e1fe337eb28b5bec30f0ee8ed29f0ff80ab6f75dcf9313efe82911065a52

ARG TLA2TOOLS_VERSION=v1.7.4
ARG TLA2TOOLS_SHA256=936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88

RUN mkdir -p /opt/tla \
    && wget -q -O /opt/tla/tla2tools.jar \
      "https://github.com/tlaplus/tlaplus/releases/download/${TLA2TOOLS_VERSION}/tla2tools.jar" \
    && echo "${TLA2TOOLS_SHA256}  /opt/tla/tla2tools.jar" | sha256sum -c -

WORKDIR /work

ENTRYPOINT ["java", "-XX:+UseParallelGC", "-cp", "/opt/tla/tla2tools.jar", "tlc2.TLC"]
