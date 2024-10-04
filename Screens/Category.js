import React from 'react'; // นำเข้า React
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'; // นำเข้าส่วนประกอบที่จำเป็นจาก React Native

// กำหนดอาร์เรย์ของหมวดหมู่หนัง
// แต่ละหมวดหมู่ประกอบด้วย id, name, subcollection, และ documentId
const categories = [
  { id: '1', name: 'Action', subcollection: 'Action', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '2', name: 'Comedy', subcollection: 'Comedy', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '3', name: 'Drama', subcollection: 'Drama', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '4', name: 'Horror', subcollection: 'Horror', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '5', name: 'Romance', subcollection: 'Romance', documentId: '9uyaTCxojw03bRPJAOFi' },
  // สามารถเพิ่มหมวดหมู่อื่น ๆ ตามต้องการได้ที่นี่
];

// คอมโพเนนต์หลักที่ใช้แสดงหมวดหมู่หนัง
// ฟังก์ชันนี้ใช้ props `navigation` เพื่อให้สามารถนำทางไปยังหน้ารายละเอียดหมวดหมู่
export default function Category({ navigation }) {
  // ฟังก์ชัน renderItem ใช้เพื่อเรนเดอร์รายการหมวดหมู่แต่ละรายการใน FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} // ใช้สไตล์ที่กำหนดไว้
      onPress={() => navigation.navigate('CategoryDetails', { // เมื่อกดที่หมวดหมู่
        subcollection: item.subcollection, // ส่งข้อมูล subcollection
        documentId: item.documentId, // ส่ง documentId
        category: item.name // ส่งชื่อหมวดหมู่
      })}
    >
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList // แสดงรายการหมวดหมู่ในรูปแบบลิสต์
        data={categories} // ข้อมูลที่จะใช้แสดง
        renderItem={renderItem} // ฟังก์ชันในการเรนเดอร์รายการ
        keyExtractor={(item) => item.id} // ใช้ id เป็น key ของแต่ละรายการ
      />
    </View>
  );
}

// สไตล์สำหรับคอมโพเนนต์
// ใช้ StyleSheet เพื่อสร้างและจัดการสไตล์ของคอมโพเนนต์ให้ดูสวยงาม
const styles = StyleSheet.create({
  container: {
    flex: 1, // ให้ใช้พื้นที่เต็ม
    backgroundColor: '#fff', // สีพื้นหลัง
    paddingTop: 50, // ช่องว่างด้านบน
  },
  item: {
    backgroundColor: '#fff', // สีพื้นหลังของแต่ละรายการ
    padding: 20, // ช่องว่างภายใน
    marginVertical: 8, // ช่องว่างด้านบนและล่าง
    marginHorizontal: 16, // ช่องว่างด้านซ้ายและขวา
    borderRadius: 10, // มุมโค้ง
    borderWidth: 1, // ขนาดของเส้นขอบ
    borderColor: '#000', // สีของเส้นขอบ
    shadowColor: "#000", // สีเงา
    shadowOffset: {
      width: 0, // การเลื่อนในแนวนอน
      height: 2, // การเลื่อนในแนวตั้ง
    },
    shadowOpacity: 0.25, // ความทึบของเงา
    shadowRadius: 3.84, // ขนาดของเงา
    elevation: 5, // ระดับของเงาใน Android
  },
  title: {
    fontSize: 18, // ขนาดตัวอักษร
    fontWeight: 'bold', // หนักของตัวอักษร
    textAlign: 'center', // จัดตัวอักษรตรงกลาง
  },
});
