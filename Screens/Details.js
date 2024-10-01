import { db } from "../Configs/Firebase";
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Button, KeyboardAvoidingView, Platform, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from '../context/AuthContext'; // Use the custom hook
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { useFocusEffect } from '@react-navigation/native';

// DetailBar Component
const DetailBar = ({ text, header, active, toggleContent }) => {
  const [contentVisible, setContentVisible] = useState(true); // Set default to true
  const opacity = useRef(new Animated.Value(1)).current; // Initialize opacity to 1 (fully visible)

  const handleToggle = () => {
    toggleContent();
    setContentVisible((prev) => !prev); // Toggle visibility

    // Animate the opacity when content visibility changes
    Animated.timing(opacity, {
      toValue: contentVisible ? 0 : 1, // Fade out if currently visible, fade in if hidden
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.accordionCard}>
      <TouchableOpacity
        style={[styles.header, active && styles.activeHeader]}
        onPress={handleToggle}
      >
        <Text style={styles.headerText}>{header}</Text>
        <Text style={[styles.icon, active && styles.rotatedIcon]}>▼</Text>
      </TouchableOpacity>
      {/* Animate opacity of the content */}
      <Animated.View style={[styles.collapse, { opacity }]}>
        {contentVisible && <Text style={styles.contentText}>{text}</Text>}
      </Animated.View>
    </View>
  );
};

// ActorBar Component
const ActorBar = ({ item, header, active, toggleContent }) => {
  const [contentVisible, setContentVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current; // Initialize opacity value

  const handleToggle = () => {
    toggleContent();
    setContentVisible((prev) => !prev); // Toggle visibility

    // Animate the opacity when content visibility changes
    Animated.timing(opacity, {
      toValue: contentVisible ? 0 : 1, // Fade in/out based on contentVisible
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.accordionCard}>
      <TouchableOpacity
        style={[styles.header, active && styles.activeHeader]}
        onPress={handleToggle}
      >
        <Text style={styles.headerText}>{header}</Text>
        <Text style={[styles.icon, active && styles.rotatedIcon]}>▼</Text>
      </TouchableOpacity>
      {/* Animate opacity of the content */}
      <Animated.View style={[styles.collapse, { opacity }]}>
        {contentVisible && (
          <View style={styles.actorContainer}>
            <View style={styles.actorRow}>
              <View style={styles.actorWrapper}>
                <Image style={styles.imageAc} source={{ uri: item.Ac01_pic }} />
                <Text style={styles.actorName}>{item.Actor01}</Text>
              </View>
              <View style={styles.actorWrapper}>
                <Image style={styles.imageAc} source={{ uri: item.Ac02_pic }} />
                <Text style={styles.actorName}>{item.Actor02}</Text>
              </View>
              <View style={styles.actorWrapper}>
                <Image style={styles.imageAc} source={{ uri: item.Ac03_pic }} />
                <Text style={styles.actorName}>{item.Actor03}</Text>
              </View>
              <View style={styles.actorWrapper}>
                <Image style={styles.imageAc} source={{ uri: item.Ac04_pic }} />
                <Text style={styles.actorName}>{item.Actor04}</Text>
              </View>
              {/* You can add more actor images and names here if needed */}
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

// Main Details Component
export default function Details({ route }) {
  const { item, userRole, documentId, category, movie_name } = route.params; // Destructure the parameters
  const { currentUser } = useAuth(); // Get the auth context
  const navigation = useNavigation(); // Initialize navigation
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(''); // State for new comment input
  const [activeDetail, setActiveDetail] = useState(true);
  const [activeActors, setActiveActors] = useState(false);

  // Toggle active accordion item for details
  const handleToggleDetail = () => {
    setActiveDetail(!activeDetail);
  };

  // Toggle active accordion item for actors
  const handleToggleActors = () => {
    setActiveActors(!activeActors);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        // Fetch comments where m_name matches item.movie_name
        const commentsQuery = query(
          collection(db, "comments"),
          where("m_name", "==", item.movie_name)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({
          cid: doc.id,
          ...doc.data()
        }));

        // Fetch display names for each unique uid in comments
        const uniqueUids = [...new Set(commentsData.map(comment => comment.uid))];
        const userDocs = await getDocs(query(collection(db, "users"), where("uid", "in", uniqueUids)));

        const users = {};
        userDocs.forEach(user => {
          users[user.data().uid] = user.data().displayName; // Map UID to display name
        });

        // Combine comments with display names
        const commentsWithUsernames = commentsData.map(comment => ({
          ...comment,
          displayName: users[comment.uid] || 'Anonymous' // Fallback if no username found
        }));

        setComments(commentsWithUsernames);
      };

      fetchData();
    }, [item.movie_name]) // Dependency array
  );

  const handleAddComment = async () => {
    if (newComment.trim() === '' || !currentUser) return;

    const uid = currentUser.uid;
    const commentData = {
      comment: newComment,
      m_name: item.movie_name,
      uid,
      createAt: new Date(),
    };

    await addDoc(collection(db, "comments"), commentData);
    setNewComment(''); // Clear input after submission
  };

  const handleDeleteMovie = async () => {
    try {
      const movieRef = doc(db, "Movie", documentId, category, movie_name);
      await deleteDoc(movieRef);
      console.log("Movie deleted successfully");
      navigation.goBack(); // Navigate back after deletion
    } catch (error) {
      console.error("Error deleting movie: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset as needed
    >
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.contentContainer}>
          {/* Movie Image */}
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: item.movie_image }} />
          </View>

          {/* Movie Details */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.movie_name}</Text>
          </View>

          {/* Description */}
          <DetailBar
            header="Description"
            text={item.movie_des}
            active={activeDetail}
            toggleContent={handleToggleDetail}
          />

          {/* Actors */}
          <ActorBar
            item={item}
            header="Actors"
            active={activeActors}
            toggleContent={handleToggleActors}
          />
        </View>

        {/* Add Comment Section */}
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Submit" onPress={handleAddComment} />
        </View>

        {/* Comments Separator */}
        <View style={styles.separator} />

        {/* Comments */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <View key={comment.cid} style={styles.commentContainer}>
              <Text style={styles.commentUsername}>{comment.displayName}</Text>
              <Text style={styles.comment}>{comment.comment}</Text>
              <Text style={styles.commentAt}>
                {comment.createAt?.toDate().toLocaleString() || 'Unknown time'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noComments}>No comments yet.</Text>
        )}
      </ScrollView>

      {/* Delete Button for Admin */}
      {userRole === 'admin' && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMovie}>
          <Text style={styles.deleteButtonText}>Delete Movie</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  scrollContentContainer: {
    paddingBottom: 100, // Ensure scroll space for comments and input
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  accordionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeHeader: {
    backgroundColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 16,
  },
  rotatedIcon: {
    transform: [{ rotate: '180deg' }],
  },
  collapse: {
    overflow: 'hidden',
  },
  contentText: {
    fontSize: 16,
    padding: 10,
  },
  actorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  actorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  actorWrapper: {
    alignItems: 'center',
    width: '45%', // Adjust the width based on your layout
    marginBottom: 10,
  },
  imageAc: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  actorName: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  addCommentContainer: {
    marginVertical: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentUsername: {
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentAt: {
    fontSize: 12,
    color: '#555',
  },
  noComments: {
    textAlign: 'center',
    color: '#555',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
