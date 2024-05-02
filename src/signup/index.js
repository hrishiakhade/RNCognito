import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { poolData } from '../constants';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSignup = () => {
        var attributeList = [];
        const userPool = new CognitoUserPool(poolData);
        var dataEmail = {
            Name: 'email',
            Value: email,
        };

        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: phoneNumber,
        };
        var attributeEmail = new CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new CognitoUserAttribute(
            dataPhoneNumber
        );

        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);

        userPool.signUp(
            username,
            password,
            attributeList,
            [],
            function (err, result) {
                if (err) {
                    Alert.alert(err.message || JSON.stringify(err));
                    return;
                }
                var cognitoUser = result?.user;
                console.log('user name is ' + cognitoUser?.getUsername());
                Alert.alert(`Hello ${cognitoUser?.getUsername()}`,
                    "Please check your email for verification code and confirm it.",
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // navigate to the confirmation screen
                                navigation.navigate('VerificationScreen', { username: cognitoUser?.getUsername() });
                            },
                        },
                    ]
                );
            });
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={'gray'}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={'gray'}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={'gray'}
                style={styles.input}
            />
            <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholderTextColor={'gray'}
                style={styles.input}
            />
            <Button
                title="Signup"
                onPress={handleSignup}
                disabled={username.length < 4 || password.length < 6 || email.length < 4 || phoneNumber.length < 10}
            />
        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        color: 'black',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
});