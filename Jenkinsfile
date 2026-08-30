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

        stage('Auth Service - Format Check') {
            steps {
                dir('services/auth-service') {
                    sh 'npm run format:check'
                }
            }
        }

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

        stage('Inventory Service - Format Check') {
            steps {
                dir('services/inventory-service') {
                    sh 'npm run format:check'
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