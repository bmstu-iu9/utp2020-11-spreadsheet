pipeline {
  agent any
  stages {
    stage('Build image') {
      steps {
        sh 'sudo docker build -t unitables .'
      }
    }

    stage('Run server') {
      steps {
        sh '''sudo docker stop unitables
sudo docker rm unitables
sudo docker run -d -p 3000:3000 -v unitables:/project/data --name unitables unitables'''
      }
    }

  }
}