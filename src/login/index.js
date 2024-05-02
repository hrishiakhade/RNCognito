import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { IdentityPoolId, poolData } from '../constants';
import * as AWS from 'aws-sdk/global';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');  //hrushi1234
    const [password, setPassword] = useState('');  //Pass123456

    const authenticateUser = () => {
        const authenticationData = {
            Username: username,
            Password: password,
        };

        var authenticationDetails = new AuthenticationDetails(
            authenticationData
        );

        const userPool = new CognitoUserPool(poolData);

        const userData = {
            Username: username,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('====================================');
                console.log("result==", result);
                console.log('====================================');
                var accessToken = result.getAccessToken().getJwtToken();
                console.log('====================================');
                console.log(accessToken);
                console.log('====================================');
                //POTENTIAL: Region needs to be set if not already set previously elsewhere.
                AWS.config.region = 'us-east-2';

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IdentityPoolId, // your identity pool id here
                    Logins: {
                        // Change the key below according to the specific region your user pool is in.
                        'cognito-idp.us-east-2.amazonaws.com/us-east-2_wWiVMTqIW': result
                            .getIdToken()
                            .getJwtToken(),
                    },
                });

                navigation.navigate('HomeScreen');

            },

            onFailure: function (err) {
                console.log('====================================');
                console.log("err==", err);
                console.log('====================================');
                Alert.alert(err.message || JSON.stringify(err));
            },
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.
                console.log("userAttributes==", userAttributes);
                navigation.navigate('HomeScreen');
                // the api doesn't accept this field back
                delete userAttributes.email_verified;
            }
        });
    }


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginBottom: 10 }}>
                <Text style={{ color: 'blue' }}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
            <Button title="Login"
                onPress={authenticateUser}
                disabled={username.length < 4 || password.length < 6}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
});

export default LoginScreen;