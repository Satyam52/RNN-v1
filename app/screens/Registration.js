import React, { PureComponent } from 'react';
import { View, Alert, ScrollView, KeyboardAvoidingView, AsyncStorage,StatusBar, TextInput, Dimensions, LayoutAnimation, Platform} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import { Container,Segment, Button, Picker, Header,Icon, Content, Form, Item, Input, Label, Left, Right, Body, Title, Card ,Text} from 'native-base';
import { getRequest, registerUser, failAction } from '../actions';
import { styles,colors,GETCITY, GETSTATE, REGISTER, FAIL } from '../actions/types';
import {  Spinner, CardSection } from '../components/common';
import LinearGradient from 'react-native-linear-gradient';

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; //January is 0!
let yyyy = today.getFullYear();
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
class Registration extends PureComponent {

    static navigatorStyle = {
        navBarHidden: true,
        statusBarTextColorScheme: 'dark'
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            p1: '',
            p2: '',
            pnumber: '',
            email: '',
            states: 1,
            gen: 0,
            city: 1,
            error: '',
            dob:yyyy+'-'+mm+'-'+dd,
            address:'',
        };
    }

    componentWillMount() {
        this.props.getRequest(GETCITY);
        this.props.getRequest(GETSTATE);
        this.setState({ error: '' });
    
    }

    componentWillUpdate() {
        Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
    }
    onEmailChange(email) {
        this.setState({ email, error: '' });
    }
    onAddressChange(address) {
        this.setState({ address, error: '' });
    }
    onP1Change(p1) {
        this.setState({ p1, error: '' });
    }
    onP2Change(p2) {
        this.setState({ p2, error: '' });
    }
    onNameChange(name) {
        this.setState({ name, error: '' });
    }
    onNumberChange(pnumber) {
        this.setState({ pnumber, error: '' });
    }

    onButtonPress = () => {
        
        let name = this.state.name;
        let email = this.state.email;
        let password1 = this.state.p1;
        let password2 = this.state.p2;
        let mobile = this.state.pnumber;
        let state = this.state.states;
        let gender = this.state.gen;
        let city = this.state.city;
        let dob = this.state.dob;
        let address = this.state.address;

        this.setState({ error: '' });

        if (name === '') {
            this.setState({ error: 'Please enter your name' });
            return;
        }
        else if (!(mobile.length >= 7)) {
            this.setState({ error: 'Phone number is Invalid' });
            return;
        }
        else if (!(email.includes('@') && email.includes('.'))) {
            this.setState({ error: 'Invalid Email ID' });
            return;
        }
        else if (!(password1.length >= 7 && password2.length >= 7)) {
            this.setState({ error: 'Password length should be greater than 6 characters' });
            return;
        }
        else if (!(password2 === password1)) {
            this.setState({ error: 'Passwords does not match' });
            return;
        }
        else if (city === null) {
            this.setState({ error: 'Select a City' });
            return;
        }
        else if (state === null) {
            this.setState({ error: 'Select a State' });
            return;
        }
        else if (gender === null) {
            this.setState({ error: 'Select a gender' });
            return;
        }
        else if (dob === yyyy + '-' + mm + '-' + dd) {
            this.setState({ error: 'Select your Date of Birth' });
            return;
        }
        else if (address === '') {
            this.setState({ error: 'Select a Address' });
            return;
        }
        if(gender==0){
            gender='m';
        }
        if(gender==1){
            gender='f';
        }
        this.props.registerUser(1, 1, name, dob, address, city, state, email, password1, 1, gender,mobile);
    }

    renderInput = (caption, onChangeText, value, secureTextEntry) => {
        return(
            <View style={styles.container}>
                <Text style={styles.textHeader}>{caption}</Text>
                <Item last >
                    <Input 
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        style={styles.textInput}
                        placeholder={'Type here !'}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        value />
                </Item>
            </View>
        );
    }

    renderPicker = (caption,selectedValue,onValueChange) => {
        let pickerItems = []
        switch (caption) {
            case 'Gender':
                let gen = ['Male', 'Female'];
                pickerItems = gen.map((s, l) => {
                    return <Picker.Item key={l} value={l} label={s} />
                });
                break;

            case 'City':
                let cities = this.props.cities.filter((city) => {
                    if (city.stateId == this.state.states) {
                        return city
                    }
                });
                pickerItems = cities.map((s, i) => {
                    return <Picker.Item key={i} value={s.id} label={s.name} />
                });
                break;

            case 'State':
                let states = this.props.states;
                pickerItems = states.map((s, i) => {
                    return <Picker.Item key={i} value={s.id} label={s.name} />
                });
                break;
        }
        return(
            <View style={styles.container} >
                <CardSection style={{ alignItems: 'center', width: SCREEN_WIDTH }}>
                    <Text style={styles.textHeader}>{caption+':'} </Text>
                    <Picker
                        style={{ width: SCREEN_WIDTH }}
                        iosHeader={caption}
                        mode="dropdown"
                        selectedValue={selectedValue}
                        onValueChange={onValueChange}
                    >
                        {pickerItems}
                    </Picker>
                </CardSection>
            </View>
        );
    }

    renderUnderScroll = () => {
        return (
            <ScrollView>
                <View style={styles.card}>
                    <View style={[{ marginBottom: 20 }]}>
                        <Text style={{ color: colors.headerPurple, fontSize: 19, padding: 5 }}>Personal : </Text>
                        {this.renderInput('Name', this.onNameChange.bind(this), this.state.name, false)}
                        {this.renderPicker('Gender', this.state.gen, (gen) => this.setState({ gen }))}
                        <View style={styles.container} >
                            <CardSection style={{ alignItems: 'center', width: SCREEN_WIDTH }}>
                                <Text style={styles.textHeader}>DOB : </Text>
                                <DatePicker
                                    style={{ width: 200 }}
                                    date={this.state.dob}
                                    mode="date"
                                    placeholder="select date"
                                    format="YYYY-MM-DD"
                                    minDate="1950-05-01"
                                    maxDate='2018-12-01'
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        btnTextText: {
                                            color: '#000000',
                                        },
                                        btnTextConfirm: {
                                            color: 'black',
                                        },
                                        btnTextCancel: {
                                            color: 'black',
                                        }
                                    }}
                                    onDateChange={(dob) => { this.setState({ dob }) }}
                                />
                            </CardSection>
                        </View>
                    </View>
                </View>
                <View style={styles.card}>
                    <View style={[{ marginBottom: 20 }]}>
                        <Text style={{ color: colors.headerPurple, fontSize: 19, padding: 5 }}>Account : </Text>
                        
                        {this.renderInput('Email', this.onEmailChange.bind(this), this.state.email, false)}
                        
                        {this.renderInput('New Password', this.onP1Change.bind(this), this.state.p1, true)}
                        
                        {this.renderInput('Retype Password', this.onP2Change.bind(this), this.state.p2, true)}
                    </View>
                </View>
                <View style={styles.card}>
                    <View style={[{ marginBottom: 20 }]}>
                        <Text style={{ color: colors.headerPurple, fontSize: 19, padding: 5 }}>Contact : </Text>
                        {this.renderInput('Phone Number', this.onNumberChange.bind(this), this.state.pnumber, false)}

                        {this.renderInput('Address', this.onAddressChange.bind(this), this.state.address, false)}

                        {this.renderPicker('State', this.state.states, (states) => {
                            let city = 0;
                            this.props.cities.forEach(obj => {
                                if (obj.stateId === states && city == 0) {
                                    city = obj.id;
                                }
                            });
                            this.setState({ city, states })
                        })}
                        {this.renderPicker('City', this.state.city, (city) => {
                            this.setState({ city })
                        })}
                    </View>
                    <Text style={{ color: 'red' }}>{this.state.error}</Text>
                </View>
                <Button full style={{ borderRadius: 10, margin: 5, borderColor: colors.snow, backgroundColor: colors.headerPurple }}
                    onPress={this.onButtonPress.bind(this)}>
                    <Text style={{ color: colors.snow }}>Sign Up</Text>
                </Button>
            </ScrollView>
        );
    }

    renderLoader = () => {
        if (this.props.loading) {
            return (
                <View style={{ margin: 30 }}>
                    <Spinner />
                </View>);
        }
        else{
            return (
                <KeyboardAvoidingView
                    behavior="padding"
                    keyboardVerticalOffset={60}
                >
                    {this.renderUnderScroll()}
                </KeyboardAvoidingView>
            );
        }
    }

    render() {       
        let width = Dimensions.get('window').width;
        let height = 40;
        
        if (this.props.reg.hasOwnProperty('email')){
            Alert.alert(
                'Awesome',
                'Registration Sucessful',
                [
                    { text: 'OK', onPress: () => {
                        this.props.failAction(FAIL + REGISTER);
                        this.props.navigator.pop()} },
                ],
                { cancelable: false }
            );
        }
        if (this.props.reg.hasOwnProperty('error')){
            Alert.alert(
                'Registration Failed',
                '' + this.props.reg.error[0].message,
                [
                    { text: 'OK', onPress: () => {
                        this.props.failAction(FAIL + REGISTER);
                    } },
                ],
                { cancelable: false }
            );
        }
        return (
            <Container>
                <View style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => {
                            this.props.navigator.pop();
                        }}>
                            <Icon name='arrow-dropleft' style={{ color: colors.snow }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: colors.snow }}>{'Registration'}</Title>
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


const mapStateToProps = ({getCity, getState, registerUser }) => {
    const loading = getCity.loading || getState.loading || registerUser.loading;
    const cities = getCity.response || [];
    const states = getState.response || [];
    const reg = registerUser.response;
    return {
        loading, cities, states, reg
    }
}


export default connect(mapStateToProps, { registerUser, getRequest, failAction })(Registration);
