import { CognitoUserPool } from 'amazon-cognito-identity-js';
import React, { useEffect } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { poolData } from '../constants';

const HomeScreen = ({ navigation }) => {

    const [data, setData] = React.useState({});

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    const handleLogout = () => {
        // Add your logout logic here
        cognitoUser.signOut();
        navigation.pop();
    };

    useEffect(() => {

        userPool.storage.sync(function (err, result) {
            if (err) {
            } else if (result === 'SUCCESS') {
                var cognitoUser = userPool.getCurrentUser();
                // Continue with steps in Use case 16
                if (cognitoUser != null) {
                    cognitoUser.getSession(function (err, session) {
                        if (err) {
                            Alert.alert(err.message || JSON.stringify(err));
                            return;
                        }
                        console.log('session validity: ' + session.isValid());

                        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
                        // cognitoUser.getUserAttributes(function (err, attributes) {
                        //     if (err) {
                        //         Alert.alert(err.message || JSON.stringify(err));
                        //         return;
                        //     } else {
                        //         setData(attributes);
                        //     }
                        // });

                        cognitoUser.getUserData(function (err, userData) {
                            if (err) {
                                Alert.alert(err.message || JSON.stringify(err));
                                return;
                            }
                            setData(userData);
                            console.log('User data for user ' + JSON.stringify(userData));
                        });


                        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        //     IdentityPoolId: IdentityPoolId, // your identity pool id here
                        //     Logins: {
                        //         // Change the key below according to the specific region your user pool is in.
                        //         'cognito-idp.us-east-2.amazonaws.com/us-east-2_wWiVMTqIW': result
                        //             .getIdToken()
                        //             .getJwtToken(),
                        //     },
                        // });
                    });
                }

            }
        });
    }, []);

    return (
        <View>
            <Text style={{ fontSize: 20, color: '#000', marginBottom: 15, fontWeight: 700 }}>Welcome {data?.Username}</Text>
            {data?.UserAttributes?.map((item, index) => (
                <Text key={index} style={{ fontSize: 18, color: '#000', fontWeight: '600', marginBottom: 10 }}>{item.Name}: <Text style={{ fontSize: 14 }}>{item.Value}</Text></Text>
            ))}
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;