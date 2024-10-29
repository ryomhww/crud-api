import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Define the Post type
type Post = {
    id: number;
    title: string;
    body: string;
};

const App = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [updateId, setUpdateId] = useState<number | null>(null); 

    const API_URL = 'https://jsonplaceholder.typicode.com/posts';

    const fetchPosts = async () => {
        const response = await axios.get<Post[]>(API_URL); 
        setPosts(response.data.reverse());
    };

    const createPost = async () => {
        const response = await axios.post<Post>(API_URL, { title, body: content }); 
        setPosts([response.data, ...posts]);
        resetFields();
    };

    const updatePost = async () => {
        const response = await axios.put<Post>(`${API_URL}/${updateId}`, { title, body: content });
        setPosts(posts.map(post => (post.id === updateId ? response.data : post)).reverse());
        resetFields();
    };

    const deletePost = async (id: number) => { 
        await axios.delete(`${API_URL}/${id}`);
        setPosts(posts.filter(post => post.id !== id).reverse());
    };

    const resetFields = () => {
        setTitle('');
        setContent('');
        setUpdateId(null);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Title"
                />
                <TextInput
                    style={styles.input}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Content"
                    multiline
                />
                <TouchableOpacity style={styles.button} onPress={updateId ? updatePost : createPost}>
                    <Text style={styles.buttonText}>{updateId ? "Update" : "Create"}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.post}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.body}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={() => {
                                setTitle(item.title);
                                setContent(item.body);
                                setUpdateId(item.id);
                            }}>
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deletePost(item.id)}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    post: {
        marginVertical: 10,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#F3C623',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF4500',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default App;
