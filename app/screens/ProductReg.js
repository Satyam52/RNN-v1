import React, { PureComponent } from 'react';
import {
    ScrollView, View, Text, StatusBar,
    Platform, Alert, LayoutAnimation, Dimensions, KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { getRequest,  postPdt, failAction } from '../actions';
import { colors,styles, FAIL,POSTPDT,GETPICKER } from '../actions/types';
import { Spinner, CardSection } from '../components/common';
import { Container, Button, Picker, Header, Content, Form, Item, Input, Label, Left, Right, Body, Title, Card, Icon } from 'native-base';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class PdtReg extends PureComponent {

    static navigatorStyle = {
        navBarHidden: true
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            error: ''
        };
    }

    componentDidMount() {
     
        this.setState({ error: '' });
    }

    componentWillUpdate() {
        Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
    }

    onNameChange(name) {
        this.setState({ name, error: '' });
    }
 
    onButtonPress() {
        
        let name = this.state.name;

        this.setState({ error: '' });

        if (name === '') {
            this.setState({ error: 'Please enter product name' });
            return;
        }
        this.props.postPdt(name);
    }

    render() {
        if (this.props.loading) {
            return <Spinner />
        }
        if (this.props.response.hasOwnProperty('id')) {
            this.props.getRequest(GETPICKER);
            Alert.alert(
                'Success',
                'Product Added Successfully',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.props.close();
                            this.props.failAction(FAIL + POSTPDT);
                            this.props.getRequest(GETPICKER);
                        }
                    },
                ],
                { cancelable: false }
            );
        }
        else if (this.props.response.hasOwnProperty('error')) {
            Alert.alert(
                'Failed',
                this.props.response.error[0].message,
                [
                    {
                        text: 'OK', onPress: () => {
                            this.props.failAction(FAIL + POSTPDT);
                        }
                    },
                ],
                { cancelable: false }
            );
        }
        return (
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={60}
            >
                <View style={[styles.card, { alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 5, height: 200, width: SCREEN_WIDTH - 50, margin: 30 }]}>
                    <View style={styles.container}>
                        <Text style={{ color: colors.lightText, fontStyle: 'italic', fontSize: 14, padding: 2 }}>Product Name</Text>
                        <Item last >
                            <Input autoCapitalize={'none'}
                                style={{
                                    color: colors.headerPurple, fontSize: 15, fontWeight: 'bold', padding: 8
                                }}
                                placeholder={'Type here !'}
                                onChangeText={this.onNameChange.bind(this)}
                                value={this.state.name} />
                        </Item>
                    </View>
                    <Text style={{ color: 'red' }}>{this.state.error}</Text>
                    <Button full transparent
                        onPress={this.onButtonPress.bind(this)}>
                        <Text style={{ color: colors.headerPurple, fontWeight: 'bold' }}> Register </Text>
                    </Button>
                </View>
            </KeyboardAvoidingView>
        );
    }
}


const mapStateToProps = ({  postProduct }) => {
    const loading =  postProduct.loading;
    const { response } = postProduct;
    return {
        loading, response
    }
}

export default connect(mapStateToProps, { getRequest,  postPdt, failAction })(PdtReg);