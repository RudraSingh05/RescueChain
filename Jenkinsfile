pipeline {
    agent {
        label 'rescuechain-agent'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Frontend CI

        stage('Frontend - Install') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend - Lint') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // Auth Service CI

        stage('Auth Service - Install') {
            steps {
                dir('services/auth-service') {
                    sh 'npm ci'
                }
            }
        }

        stage('Auth Service - Lint') {
            steps {
                dir('services/auth-service') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Auth Service - Test') {
            steps {
                dir('services/auth-service') {
                    sh 'npm test'
                }
            }
        }

        stage('Auth Service - Format Check') {
            steps {
                dir('services/auth-service') {
                    sh 'npm run format:check'
                }
            }
        }

        // Inventory Service CI

        stage('Inventory Service - Install') {
            steps {
                dir('services/inventory-service') {
                    sh 'npm ci'
                }
            }
        }

        stage('Inventory Service - Lint') {
            steps {
                dir('services/inventory-service') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Inventory Service - Test') {
            steps {
                dir('services/inventory-service') {
                    sh 'npm test'
                }
            }
        }

        stage('Inventory Service - Format Check') {
            steps {
                dir('services/inventory-service') {
                    sh 'npm run format:check'
                }
            }
        }

        // SonarQube Analysis

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube-Scanner'

                    withSonarQubeEnv('RescueChain-SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=rescuechain \
                                -Dsonar.projectName=RescueChain \
                                -Dsonar.sources=frontend/src,services/auth-service/src,services/inventory-service/src \
                                -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**
                        """
                    }
                }
            }
        }

        // Docker Build

        stage('Docker Build - Frontend') {
            steps {
                sh '''
                    docker build \
                    -t rudrasingh05/rescuechain-frontend:${BUILD_NUMBER} \
                    -t rudrasingh05/rescuechain-frontend:latest \
                    ./frontend
                '''
            }
        }

        stage('Docker Build - Auth Service') {
            steps {
                sh '''
                    docker build \
                    -t rudrasingh05/rescuechain-auth-service:${BUILD_NUMBER} \
                    -t rudrasingh05/rescuechain-auth-service:latest \
                    ./services/auth-service
                '''
            }
        }

        stage('Docker Build - Inventory Service') {
            steps {
                sh '''
                    docker build \
                    -t rudrasingh05/rescuechain-inventory-service:${BUILD_NUMBER} \
                    -t rudrasingh05/rescuechain-inventory-service:latest \
                    ./services/inventory-service
                '''
            }
        }

        // Docker Push

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | docker login \
                            -u "$DOCKERHUB_USERNAME" \
                            --password-stdin

                        docker push "$DOCKERHUB_USERNAME/rescuechain-frontend:${BUILD_NUMBER}"
                        docker push "$DOCKERHUB_USERNAME/rescuechain-frontend:latest"

                        docker push "$DOCKERHUB_USERNAME/rescuechain-auth-service:${BUILD_NUMBER}"
                        docker push "$DOCKERHUB_USERNAME/rescuechain-auth-service:latest"

                        docker push "$DOCKERHUB_USERNAME/rescuechain-inventory-service:${BUILD_NUMBER}"
                        docker push "$DOCKERHUB_USERNAME/rescuechain-inventory-service:latest"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ RescueChain CI Pipeline Passed'
        }

        failure {
            echo '❌ RescueChain CI Pipeline Failed'
        }
    }
}