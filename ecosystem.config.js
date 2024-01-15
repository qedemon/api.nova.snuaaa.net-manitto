module.exports = {
    apps: [
      {
        name: 'nova_api_manitto', // 애플리케이션 이름
        cwd: `${__dirname}`,
        script: 'server.js', // 실행될 스크립트 파일
        instances: 'max', // 인스턴스 수 (여러 개의 인스턴스를 띄울 경우 'max'를 사용하여 최대 CPU 코어 수로 설정)
        exec_mode: 'cluster', // 인스턴스 실행 모드 (cluster 또는 fork)
        autorestart: true, // 애플리케이션 비정상 종료 시 자동으로 재시작
        watch: false, // 파일 변경 감지 시 애플리케이션 자동 재시작 (개발 환경에서 유용)
        ignore_watch: ``,
        max_memory_restart: '1G', // 메모리 한도를 넘어설 경우 애플리케이션 자동 재시작
        env: {
          "NODE_PATH": `${__dirname}`
        }
      }
    ],
  };
  