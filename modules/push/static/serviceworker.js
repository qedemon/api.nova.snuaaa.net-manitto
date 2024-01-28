self.addEventListener("push", (event)=>{
    const {title, body, icon, tag} = JSON.parse(event.data && event.data.text());
});

self.addEventListener("notificationclick", (event)=>{
    event.notification.close();
})