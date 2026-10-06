FROM jenkins/inbound-agent:jdk21

USER root

# Install required CLI tools
RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        ca-certificates \
        gnupg \
        docker.io && \
    rm -rf /var/lib/apt/lists/*

# Install current Node.js 22 LTS line for Jenkins CI / SonarQube JS analysis
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Allow Jenkins user to access the mounted Docker socket
RUN groupadd -f docker && \
    usermod -aG docker jenkins

USER jenkins