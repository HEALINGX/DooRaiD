import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Configs/Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Configs/Firebase";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        displayName: displayName,
        email: user.email,
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log("ผู้ใช้ถูกลงทะเบียนด้วยชื่อแสดง:", displayName);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการลงทะเบียนด้วยอีเมล:", error.message);
      throw new Error("เกิดข้อผิดพลาดระหว่างการลงทะเบียนด้วยอีเมล: " + error.message);
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบด้วยอีเมล:", error.message);
      throw new Error("เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบด้วยอีเมล: " + error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการออกจากระบบ:", error.message);
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
