import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Configs/Firebase";

const Profile = ({ navigation }) => {
    const { currentUser, logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigation.navigate('Login'); // Navigate to login screen after logout
        } catch (error) {
            Alert.alert('Logout Failed', error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#16247d" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {userData ? (
                <View style={styles.infoContainer}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Username:</Text>
                        <Text style={styles.infoText}>{userData.displayName}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoText}>{userData.email}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.infoText}>No user data found.</Text>
            )}
            <View style={styles.logoutContainer}>
                <Button title="Logout" onPress={handleLogout} color="#16247d" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    infoContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    infoLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#555',
    },
    infoText: {
        fontSize: 18,
        color: '#333',
    },
    logoutContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
});

export default Profile;
