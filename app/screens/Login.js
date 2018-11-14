import React, { PureComponent } from 'react';
import { AsyncStorage,UIManager, StatusBar, KeyboardAvoidingView, Image, View, TextInput, Dimensions, Alert, LayoutAnimation, Platform} from 'react-native';
import { connect } from 'react-redux';
import { Container, Button, Picker, Header, Content, Form, Item, Input, Label, Left, Right, Body, Title, Card, Text, Icon } from 'native-base';
import {
  colors,
  LOGIN,
  FAIL,
  styles
} from '../actions/types';
import LinearGradient from 'react-native-linear-gradient';
import { Spinner, CardSection } from '../components/common';
import { loginUser , getRequest, failAction} from '../actions';
import openApp from '../App';
import SplashScreen from 'react-native-splash-screen';

class Login extends PureComponent {

  async componentWillMount() {

    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    await SplashScreen.hide();
  }

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  }

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      email: '',
      password: ''    };
  }

  componentWillUpdate() {
    Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
  }

  update(){
    if (this.props.response.hasOwnProperty('email') && this.props.response.hasOwnProperty('password')) {
      this.props.failAction(FAIL + LOGIN);
      openApp();
    }
    else if (this.props.response.hasOwnProperty('message')) {
      Alert.alert(
        'Authentication Failed',
        '' + this.props.response.message,
        [
          {
            text: 'OK', onPress: () => {
              this.props.failAction(FAIL + LOGIN);
            }
          },
        ],
        { cancelable: false }
      );
    }
  }

  onEmailChange(email) {
      this.setState({ email,error:'' });
  }

  onPasswordChange(password) {
      this.setState({ password, error:'' });
  }

  onButtonPress() {
    const { email, password } = this.state;
      if (!(email.includes('@') && email.includes('.'))) {
        this.setState({ error: 'Invalid Email ID' });
        return;
      } else if (!(password.length)) {
        this.setState({ error: 'Empty Password' });
        return;
      }
      this.props.loginUser(email, password);
  }

  renderButton() {
    if(this.props.loading){
      return(
        <Spinner />);
    }
    return (
      <Button transparent full
        onPress={this.onButtonPress.bind(this)}>
        <Text style={{ color: colors.headerPurple, fontWeight:'bold'}}>Login</Text>
      </Button>
    );
  }

  renderCard = () => {
    let width = Dimensions.get('window').width;
    let height = 100;
    
      return(
        <View style={[styles.card,{width:width-40}]}>
          <View style={styles.container}>
            <Text style={styles.textHeader}>Email</Text>
            <Item last >
              <Input autoCapitalize={'none'}
                autoCorrect={false}
                style={styles.textInput}
                placeholder={'Type here !'}
                onChangeText={this.onEmailChange.bind(this)}
                value={this.state.email} />
            </Item>
          </View>
          <View style={styles.container}>
            <Text style={styles.textHeader}>Password</Text>
            <Item last >
              <Input autoCapitalize={'none'}
                secureTextEntry
                autoCorrect={false}
                style={styles.textInput}
                placeholder={'It is secure ! Go ahead'}
                onChangeText={this.onPasswordChange.bind(this)}
                value={this.state.password} />
            </Item>
          </View>
          <Text style={{ color: 'red', fontStyle: 'italic' }}>{this.state.error}</Text>
          {this.renderButton()}
          <CardSection style={{alignItems:'center',justifyContent:'center'}}>
            <Text style={{ color: colors.lightText, paddingLeft: 5 }}>Don’t have an account ? </Text>
            <Button transparent onPress={() => {
              this.props.navigator.push({
                screen: 'Register',
                title: 'User Registration'
              });
            }}><Text style={{ fontStyle: 'italic', fontWeight: 'bold', color: colors.lightText }}>Register</Text>
            </Button>
          </CardSection>
        </View>
      );
    
  }

  render() {
    let width = Dimensions.get('window').width;
    let height = 100;
    this.update();
    return (
      <LinearGradient colors={styles.linearGrad} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar
          barStyle="light-content"
        />
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={60}
        >
      <Text style={{color:colors.snow,padding:20,fontSize:40,fontStyle:'italic',alignSelf:'center'}}>Agrone</Text>
          {this.renderCard()}
          </KeyboardAvoidingView>
        </LinearGradient>
    );
  }
}

const mapStateToProps = ({ loginReducer  }) => {
  const loading = loginReducer.loading; 
  const { response } = loginReducer;
  return {
    loading, response
    };
};


export default connect(mapStateToProps, { loginUser, getRequest, failAction })(Login);
