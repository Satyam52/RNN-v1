import React, { PureComponent } from 'react';
import { View, AsyncStorage,  Dimensions,StatusBar, LayoutAnimation, Platform, Alert } from 'react-native';
import { getRequest } from '../actions';
import openApp from '../App';
import { colors,styles } from '../actions/types';
import { Container, Badge, H1, H2,Form, H3, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { CardSection, Spinner } from '../components/common';
import LinearGradient from 'react-native-linear-gradient';
import { realm } from '../realm';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
class Profile extends PureComponent {

  async componentWillMount() {
    await AsyncStorage.getItem('user').then((response) => {
      this.setState({
        user: JSON.parse(response)
      })
    }).catch(() => console.log('error'));
  }

  state={
    user:{}
  }

  static navigatorStyle = {
    navBarHidden: true
  }

  componentDidUpdate() {
    Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
  }

  renderName = () => {
    if(!this.state.user){
      return (
        <View style={{ margin: 30 }}>
          <Spinner />
        </View>);
    }
    return(
      <View style={[styles.card, { alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH - 40 }]}>
        <Icon name='person' style={{ color: colors.headerPurple, fontSize: 50, alignSelf: 'center' }} />
        <Text style={{ color: colors.headerPurple, padding: 10, fontSize: (Platform.OS === 'ios') ? 16 : 19, fontStyle: 'italic', alignSelf: 'center' }}>{this.state.user.name}</Text>
        <Text style={{ color: colors.lightText, padding: 10, fontSize: (Platform.OS === 'ios') ? 16 : 19, alignSelf: 'center' }}>{this.state.user.email}</Text>
        <Button transparent full onPress={() => {
          Alert.alert(
            'Confirmation',
            'All data stored offline will get deleted. Are you sure you want to log out ? ',
            [
              {
                text: 'Yes', onPress: () => {
                  realm.write(() => {
                    realm.deleteAll();
                  });
                  AsyncStorage.removeItem('auth');
                  AsyncStorage.removeItem('user');
                  openApp();
                }
              },
              { text: 'No', onPress: () => console.log('Did not log out') },
            ],
            { cancelable: false }
          );
        }}>
          <Text style={{ fontStyle: 'italic', fontSize: (Platform.OS === 'ios') ? 16 : 19, fontWeight: 'bold', color: colors.headerPurple }}>Logout</Text>
        </Button>
      </View>
    );
  }

  render() {
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
            <Title style={{ color: colors.snow }}>Profile</Title>
          </Body>
          <Right />
        </View>
        <LinearGradient colors={styles.linearGrad} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <StatusBar
            barStyle="light-content"
          />
          {this.renderName()}
        </LinearGradient>
      </Container>
    );
  }
}


export default Profile;
