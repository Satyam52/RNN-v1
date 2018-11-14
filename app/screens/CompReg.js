import React, {PureComponent} from 'react';
import {
    ScrollView, View, Text, Image, Keyboard, StatusBar,
    Platform, Alert, LayoutAnimation, Dimensions, KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { getRequest, postCompany, failAction } from '../actions';
import { colors,styles,GETCITY, GETSTATE, POSTCOMPANY , FAIL, GETCOMPANY} from '../actions/types';
import { Spinner, CardSection } from '../components/common';
import { Container, Button, Picker, Header, Content, Form, Item, Input, Label, Left, Right, Body, Title, Card , Icon} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
class CompReg extends PureComponent{

    static navigatorStyle = {
        navBarHidden: true
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            pnumber: '',
            states: 1,
            city: 1,
            error: '',
            address: ''
        };
    }

    componentDidMount() {
        this.props.getRequest(GETCITY);
        this.props.getRequest(GETSTATE);
        this.setState({ error: '' });
        
    }

    componentWillUpdate() {
        Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
    }
    onAddressChange(address) {
        this.setState({ address, error: '' });
    }
    onNameChange(name) {
        this.setState({ name, error: '' });
    }
    onNumberChange(pnumber) {
        this.setState({ pnumber, error: '' });
    }

    renderItem(query) {
        switch (query) {
            case 'city':
                let cities = this.props.cities.filter((city) => {
                    if (city.stateId == this.state.states) {
                        return city
                    }
                });                let ct = cities.map((s, i) => {
                    return <Picker.Item key={i} value={s.id} label={s.name} />
                });
                return ct;

            case 'state':
                let states = this.props.states;
                let st = states.map((s, i) => {
                    return <Picker.Item key={i} value={s.id} label={s.name} />
                });
                return st;
            default:
                return [];
        }
    }

    onButtonPress() {
       
        let name = this.state.name;
        let contactNumber = this.state.pnumber.toString();
        let stateId = this.state.states;
        let cityId = this.state.city;
        let address = this.state.address;

        this.setState({ error: '' });

        if (name === '') {
            this.setState({ error: 'Please enter company name' });
            return;
        }
        else if (!(contactNumber.length >= 7)) {
            this.setState({ error: 'Phone number is invalid' });
            return;
        }
        else if (cityId === null) {
            this.setState({ error: 'Select a City' });
            return;
        }
        else if (stateId === null) {
            this.setState({ error: 'Select a State' });
            return;
        }
        else if (address === '') {
            this.setState({ error: 'Select an Address' });
            return;
        }
        
        let d = new Date();
        let createdBy = 1;
        let updatedBy = 1;
        let createdAt = d.toISOString();
        let updatedAt = d.toISOString();
        this.props.postCompany(name, address, cityId, stateId, createdBy, updatedBy, contactNumber) 
    }

    renderUnderScroll = () => {
        return (
            <ScrollView>
                <View style={styles.card}>

                    <View style={styles.container}>
                        <Text style={styles.textHeader}>Company Name</Text>
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
                    <View style={styles.container}>
                        <Text style={styles.textHeader}>Phone Number</Text>
                        <Item last >
                            <Input autoCapitalize={'none'}
                                style={{
                                    color: colors.headerPurple, fontSize: 15, fontWeight: 'bold', padding: 8
                                }}
                                placeholder={'Type here !'}
                                onChangeText={this.onNumberChange.bind(this)}
                                value={this.state.pnumber} />
                        </Item>
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.textHeader}>Address</Text>
                        <Item last >
                            <Input autoCapitalize={'none'}
                                style={styles.textInput}
                                autoCorrect={false}
                                placeholder={'Type here !'}
                                onChangeText={this.onAddressChange.bind(this)}
                                value={this.state.address} />
                        </Item>
                    </View>
                    <View style={styles.container} >
                        <CardSection style={{ alignItems: 'center', width: SCREEN_WIDTH }}>
                            <Text style={styles.textHeader}>State : </Text>
                            <Picker
                                style={{ width: SCREEN_WIDTH }}         

                                iosHeader="State"
                                mode="dropdown"
                                selectedValue={this.state.states}
                                onValueChange={(states) => {
                                    let city = 0;
                                    this.props.cities.forEach(obj => {
                                        if (obj.stateId === states && city == 0) {
                                            city = obj.id;
                                        }
                                    });
                                    this.setState({ city, states })
                                }}
                            >
                                {this.renderItem('state')}
                            </Picker>
                        </CardSection>
                    </View>
                    <View style={styles.container} >
                        <CardSection style={{ alignItems: 'center', width: SCREEN_WIDTH }}>
                            <Text style={styles.textHeader}>City : </Text>
                            <Picker
                                style={{ width: SCREEN_WIDTH }}         

                                iosHeader="City"
                                mode="dropdown"
                                selectedValue={this.state.city}
                                onValueChange={(city) => {

                                    this.setState({ city })
                                }}
                            >
                                {this.renderItem('city')}
                            </Picker>
                        </CardSection>
                    </View>
                    <Text style={{ color: 'red' }}>{this.state.error}</Text>

                </View>
                <Button full style={{ borderRadius: 10, margin: 5, borderColor: colors.snow, backgroundColor: colors.headerPurple }}
                    onPress={this.onButtonPress.bind(this)}>
                    <Text style={{ color: colors.snow }}>Register</Text></Button>
            </ScrollView>
        );
    }

    renderLoader = () => {
        if (this.state.loading) {
            return (
                <View style={{ margin: 30 }}>
                    <Spinner />
                </View>);
        }
        else {
            return (<KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={60}
            >
                {this.renderUnderScroll()}
            </KeyboardAvoidingView>);
        }
    }


    render(){

        if(this.props.response.hasOwnProperty('id')){
            Alert.alert(
                'Success',
                'Company Added Successfully',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.props.navigator.pop();
                            this.props.failAction(FAIL + POSTCOMPANY);
                            this.props.getRequest(GETCOMPANY);
                        }
                    },
                ],
                { cancelable: false }
            );
        }
        else if (this.props.response.hasOwnProperty('error')){
            Alert.alert(
                'Failed',
                this.props.response.error[0].message,
                [
                    {
                        text: 'OK', onPress: () => {
                            this.props.failAction(FAIL + POSTCOMPANY);                        }
                    },
                ],
                { cancelable: false }
            );
        }
        return (

            <Container>
                <View style={styles.header}>                   
                 <Left>
                        <Button transparent onPress={() => {
                            this.props.navigator.pop()
                        }}>
                            <Icon name='arrow-dropleft' style={{ color: colors.snow }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: colors.snow }}>Company Registration</Title>
                    </Body>
                    <Right />
                </View>
                <LinearGradient colors={styles.linearGrad} style={{ flex: 1 }}>
                    <StatusBar
                        barStyle="light-content"
                    />
                    {this.renderLoader()}
                </LinearGradient>
            </Container>

       );
    }
}

const mapStateToProps = ({ getCity, getState, postCompany}) => {
    const loading = getCity.loading || getState.loading || postCompany.loading;
    const cities = getCity.response || [];
    const states = getState.response || [];
    const {response} = postCompany;
    return {
        loading, cities, states,response
    }
}

export default connect(mapStateToProps,{getRequest,postCompany, failAction})(CompReg);