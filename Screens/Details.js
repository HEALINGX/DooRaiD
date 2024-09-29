import { db } from '../Configs/Firebase';
import { collection, getDocs, query, where, addDoc, orderBy } from 'firebase/firestore';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Use the custom hook

export default function Details({ route }) {
  const { item } = route.params;
  const { currentUser } = useAuth(); // Get the auth context
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(''); // State for new comment input

  useEffect(() => {
    const fetchData = async () => {
      // Fetch movies
      const querySnapshot = await getDocs(collection(db, "Movie"));
      const docsData = querySnapshot.docs.map(doc => doc.data());
      setData(docsData);
    
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
      const uniqueUids = [...new Set(commentsData.map(comment => comment.uid))]; // Get unique UIDs
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
  }, [item.movie_name]);

  const handleAddComment = async () => {
    if (newComment.trim() === '' || !currentUser) return; // Prevent adding empty comments or if user is not logged in

    const uid = currentUser.uid; // Get the current user's uid
    console.log(uid);
    const commentData = {
      comment: newComment,
      m_name: item.movie_name,
      uid,
      createAt: new Date(), // Save the current timestamp
    };

    await addDoc(collection(db, "comments"), commentData);
    setNewComment(''); // Clear input after submission
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

          {/* Actors Container */}
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
            </View>
          </View>
        </View>

        {/* Movie Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.movie_name}</Text>
          <Text style={styles.description}>{item.movie_des}</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 300,
    borderRadius: 10,
  },
  actorContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  actorWrapper: {
    alignItems: 'center',
    margin: 10,
    width: '30%',
  },
  imageAc: {
    width: 60,
    height: 100,
    borderRadius: 10,
  },
  actorName: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  detailsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  separator: {
    height: 16, // Space between the add comment section and comments
  },
  commentContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  commentUsername: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  comment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  commentAt: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  },
  addCommentContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  noComments: {
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
  },
});