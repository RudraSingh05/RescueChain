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

        // stage('Frontend - Lint') {
        //     steps {
        //         dir('frontend') {
        //             sh 'npm run lint'
        //         }
        //     }
        // }

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

        // stage('Auth Service - Lint') {
        //     steps {
        //         dir('services/auth-service') {
        //             sh 'npm run lint'
        //         }
        //     }
        // }

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

        // stage('Inventory Service - Lint') {
        //     steps {
        //         dir('services/inventory-service') {
        //             sh 'npm run lint'
        //         }
        //     }
        // }

        stage('Inventory Service - Format Check') {
            steps {
                dir('services/inventory-service') {
                    sh 'npm run format:check'
                }
            }
        }

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