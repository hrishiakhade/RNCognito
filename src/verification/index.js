import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { poolData } from '../constants';

const VerificationScreen = ({ route, navigation }) => {
    const [code, setCode] = useState('');
    const [inputs, setInputs] = useState([1, 2, 3, 4, 5, 6]);
    const ref = useRef([]); // Array to hold TextInput refs
    const [username, setUsername] = useState('');

    useEffect(() => {
        const { username } = route.params; // Destructure username from route params
        setUsername(username);
        console.log('====================================');
        console.log('Username passed:', username);
        console.log('====================================');
    }, [route.params]); // Dependency array ensures useEffect runs only when params change


    const handleVerify = () => {
        // Perform verification logic here
        console.log('Verifying code:', code);
        var userPool = new CognitoUserPool(poolData);

        var userData = {
            Username: username,
            Pool: userPool,
        };
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, function (err, result) {
            if (err) {
                Alert.alert(err.message || JSON.stringify(err));
                return;
            }
            console.log('====================================');
            console.log("Verifivation : ", result);
            console.log('====================================');
            ToastAndroid.show('User verified successfully', ToastAndroid.SHORT);
            navigation.pop(2);
        });

    };


    const handleInputChange = (text, index) => {
        const newCode = code.slice(0, index) + text + code.slice(index + 1);
        setCode(newCode);

        // Focus the next input if available
        if (index < inputs.length - 1 && text.length === 1) {
            ref.current[index + 1].focus();
        }
    };


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                {inputs.map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(input) => (ref.current[index] = input)}
                        style={styles.textInput}
                        keyboardType="numeric"
                        placeholderTextColor={'gray'}
                        maxLength={1}
                        onChangeText={(text) => handleInputChange(text, index)}
                    />
                ))}
            </View>
            <Button title="Verify" onPress={handleVerify} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        width: 40,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 5,
        textAlign: 'center',
    },
    textInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 5,
        color: 'black',
    },
});

export default VerificationScreen;