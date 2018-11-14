import React, { PureComponent } from 'react';
import {  View,NetInfo, AsyncStorage, FlatList,StatusBar, Dimensions, LayoutAnimation, Platform, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { getRequest } from '../actions';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { GETANSWERS, GETQUESTION, GETCOMPANY, GETCITY, GETSTATE, GETPICKER, QUESTIONS , colors, styles} from '../actions/types';
import {  Spinner, CardSection } from '../components/common';
import FormCard from './FormCard';
import { Provider } from 'react-redux';
import store from '../store';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from 'react-native-splash-screen';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
class Home extends PureComponent {


  constructor(props){
    super(props);
    this.state = {
      refreshing: false,
    }  
  }

  async componentWillMount() {
    await NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
    await this.props.getRequest(GETCITY);
    await this.props.getRequest(GETSTATE);
    await this.props.getRequest(GETQUESTION);
    await this.props.getRequest(GETCOMPANY);
    await this.props.getRequest(GETANSWERS);
    await this.props.getRequest(GETPICKER);
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    await SplashScreen.hide();

  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    if(isConnected){
      this.handleRefresh()
    }
  };

  _keyExtractor = (item,i) => i;

  _card_pressed = (data) => {
    this.props.navigator.push({
      screen: 'RecordInfo',
      title:'Record Info',
      passProps: {
        data
      }
    });
  }

  handleRefresh = () => {
    this.setState({refreshing:true});
    this.props.getRequest(GETCOMPANY);
    this.props.getRequest(GETANSWERS);
    setTimeout(() => this.setState({refreshing:false}), 3000);
    this.props.getRequest(GETPICKER);

  }

  renderFlatlist = () => {
    if(!this.props.records.length){
      return (
        <View style={[styles.card,{margin: 10, height: 150}]}>
        <Text style={{margin:10, color:colors.headerPurple, alignSelf:'center'}}>Create a new form to get started</Text>
        </View>
      )
    }
    else{
      return(
        <FlatList
          data={this.props.records}
          keyExtractor={this._keyExtractor}
          renderItem={(data) => {
            return (
              <Provider store={store}>
                <FormCard
                  data={data.item}
                  oncardpress={this._card_pressed.bind(this, data.item)}
                  navigator={this.props.navigator}
                  style={{ width: SCREEN_WIDTH - 20 }}
                />
              </Provider>);
          }}
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh.bind(this)}
            tintColor={colors.snow}
            colors={[colors.headerPurple]}
          />}
        />       
      );
    }
  }

  render() {
    
    return (
      <Container>
        <View style={styles.header}>
          <Left/>
          <Body>
            <Title style={{color:colors.snow}}>Agrone</Title>
          </Body>
          <Right >
            <Button transparent onPress={() => {
              this.props.navigator.push({
                screen: "Profile",
                passProps: {
                  close: () => this.props.navigator.pop()
                }
              });
            }}>
              <Icon name='person' style={{ color: colors.snow }} />
            </Button>
          </Right>
        </View>
        <LinearGradient colors={styles.linearGrad} style={{flex:1, height: SCREEN_HEIGHT}}>
          <StatusBar
            barStyle="light-content"
          />
          {this.renderFlatlist()}
           </LinearGradient>
        <Footer style={{ backgroundColor: colors.darkPurple}}>
          <FooterTab style={{backgroundColor:colors.darkPurple}}>
            <Button full onPress={() => {
              this.props.navigator.push({
                screen: 'Edit',
                title: 'New Form',
                passProps: {
                  header: 'New Form',
                }
              });
            }}>
              <CardSection>
                <Icon ios='ios-create' android="md-create" style={{color:colors.snow}}/>
                <Text style={{ paddingTop: 5, color: colors.snow , fontSize:16}}>New Form</Text>
              </CardSection>
            </Button>
          </FooterTab>
        </Footer>
      </Container>      
    );
  }
}

const mapStateToProps = ({ getAnswers, getCompanies }) => {
  const loading = getAnswers.loading;
  const records = getAnswers.response;
  return { records,loading };
};

export default connect(mapStateToProps, { getRequest })(Home);
