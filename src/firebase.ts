import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  get,
  Database,
  set,
  remove,
  update
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4HUQi16FJFdP_RUmJEaqRz8jJ9XFUGAw",
  authDomain: "kahoot-e5521.firebaseapp.com",
  databaseURL: "https://kahoot-e5521-default-rtdb.firebaseio.com",
  projectId: "kahoot-e5521",
  storageBucket: "kahoot-e5521.appspot.com",
  messagingSenderId: "244445885237",
  appId: "1:244445885237:web:3415a5822822d8a310527c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class DatabaseORM {
  _database: Database;
  constructor() {
    this._database = database;
  }

  subscribe(handler: (data: any) => void, path: string) {
    let currentRef = ref(this._database, path);
    onValue(currentRef, (snapshot) => {
      const data = snapshot.val();
      handler(data);
    });
  }

  read(handler: (data: any) => void, path: string) {
    let currentRef = ref(this._database, path);
    get(currentRef).then((snapshot) => {
      if (snapshot.exists()) {
        handler(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  }

  write(data: any, path: string) {
    let currentRef = ref(this._database, path);
    set(currentRef, data);
  }

  delete(path: string) {
    let currentRef = ref(this._database, path);
    remove(currentRef);
  }
  update(data: any, path: string) {
    let currentRef = ref(this._database, path);
    update(currentRef, data);
  }
}

export { DatabaseORM };
