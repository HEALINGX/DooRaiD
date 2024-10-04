import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Configs/Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Configs/Firebase";

// สร้าง Context สำหรับการจัดการการเข้าสู่ระบบ
const AuthContext = createContext(null);

// Hook สำหรับใช้ Context นี้ในคอมโพเนนต์อื่น
export const useAuth = () => {
  return useContext(AuthContext);
}

// คอมโพเนนต์ AuthProvider สำหรับจัดการสถานะการเข้าสู่ระบบ
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // สถานะของผู้ใช้ปัจจุบัน
  const [loading, setLoading] = useState(true); // สถานะการโหลด

  useEffect(() => {
    // ฟังการเปลี่ยนแปลงสถานะการเข้าสู่ระบบ
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user); // อัปเดตสถานะผู้ใช้
      setLoading(false); // ยกเลิกสถานะการโหลด
    });

    return () => unsubscribe(); // ลบฟังเมื่อคอมโพเนนต์ไม่อยู่ในหน้าจออีกต่อไป
  }, []);

  // ฟังก์ชันสำหรับการลงทะเบียนด้วยอีเมล
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // สร้างผู้ใช้ใหม่
      const user = userCredential.user; // ดึงข้อมูลผู้ใช้
      const userData = {
        uid: user.uid,
        displayName: displayName,
        email: user.email,
        role: "user" // กำหนดบทบาทของผู้ใช้
      };
      await setDoc(doc(db, 'users', user.uid), userData); // บันทึกข้อมูลผู้ใช้ใน Firestore
      console.log("ผู้ใช้ถูกลงทะเบียนด้วยชื่อแสดง:", displayName); // แสดงข้อความเมื่อสมัครสมาชิกสำเร็จ
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการลงทะเบียนด้วยอีเมล:", error.message); // แสดงข้อผิดพลาดถ้ามี
      throw new Error("เกิดข้อผิดพลาดระหว่างการลงทะเบียนด้วยอีเมล: " + error.message); // ส่งข้อผิดพลาดต่อ
    }
  }

  // ฟังก์ชันสำหรับการเข้าสู่ระบบด้วยอีเมล
  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password); // เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบด้วยอีเมล:", error.message); // แสดงข้อผิดพลาดถ้ามี
      throw new Error("เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบด้วยอีเมล: " + error.message); // ส่งข้อผิดพลาดต่อ
    }
  };

  // ฟังก์ชันสำหรับการออกจากระบบ
  const logout = async () => {
    try {
      await signOut(auth); // ออกจากระบบ
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการออกจากระบบ:", error.message); // แสดงข้อผิดพลาดถ้ามี
    }
  };

  // กำหนดค่าที่จะส่งออกจาก AuthContext
  const value = {
    currentUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    logout,
  }

  // ส่ง Context Provider พร้อมกับเด็ก (children) ที่ไม่อยู่ในสถานะโหลด
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
