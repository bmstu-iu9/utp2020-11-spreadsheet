pipeline {
  agent any
  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run server') {
      steps {
        sh 'npm run run'
      }
    }

  }
}