
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(user=>{
    if(user){
        document.getElementById("auth").style.display="none";
        document.getElementById("app").style.display="flex";
        loadTasks();
    } else {
        document.getElementById("auth").style.display="block";
        document.getElementById("app").style.display="none";
    }
});

function register(){
    auth.createUserWithEmailAndPassword(email.value,password.value);
}

function login(){
    auth.signInWithEmailAndPassword(email.value,password.value);
}

function logout(){
    auth.signOut();
}

function addTask(){
    const user = auth.currentUser;
    db.collection("tasks").add({
        uid:user.uid,
        text:taskInput.value,
        created:new Date()
    });
    taskInput.value="";
}

function loadTasks(){
    const container = document.getElementById("tasks");
    const user = auth.currentUser;

    db.collection("tasks")
    .where("uid","==",user.uid)
    .onSnapshot(snap=>{
        container.innerHTML="";
        snap.forEach(doc=>{
            const div = document.createElement("div");
            div.className="task";
            div.innerHTML = doc.data().text +
            ' <button onclick="del(\''+doc.id+'\')">X</button>';
            container.appendChild(div);
        });
    });
}

function del(id){
    db.collection("tasks").doc(id).delete();
}
