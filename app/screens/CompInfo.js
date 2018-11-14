import { CardSection} from '../components/common';
import React, { Component } from 'react';
import {
   UIManager, View,  TouchableHighlight, Platform, LayoutAnimation, Dimensions
} from 'react-native';
import { realm } from '../realm';
import { colors,styles, COMPANIES, CITIES, STATES } from '../actions/types';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Badge, H1, H2, H3, Header, Thumbnail, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, CardItem, Card } from 'native-base';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
let cR = realm.objects(COMPANIES);
let ct = realm.objects(CITIES);
let st = realm.objects(STATES);

class CompInfo extends Component {

    componentDidUpdate() {

        Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
    }

    renderItem(){
        let comp = cR.filtered('id="' + this.props.id + '"')[0];
        let city = ct.filtered('id="' + comp.cityId + '"')[0].name;
        let state = st.filtered('id="' + comp.stateId + '"')[0].name;
        let fontSize = Platform.OS === 'ios' ? 13 :17
        return(
            <View style={{marginTop:20}}>
                <CardSection><Text style={{color:colors.lightText,fontStyle:'italic',fontSize:14}}>Company name :</Text>
                    <Text style={{color:colors.headerPurple, fontSize,fontWeight:'bold'}} selectable> {comp.name} </Text>
                    </CardSection>
                <CardSection><Text style={{ color: colors.lightText,fontStyle:'italic',fontSize:14 }}>Address : </Text>
                    <Text style={{ color: colors.headerPurple, fontSize,fontWeight:'bold' }} selectable> {comp.address} </Text>
                    </CardSection>
                <CardSection><Text style={{ color: colors.lightText,fontStyle:'italic',fontSize:14 }}>Phone Number : </Text>
                    <Text style={{ color: colors.headerPurple, fontSize,fontWeight:'bold' }} selectable> {comp.contactNumber} </Text>
                    </CardSection>
                <CardSection><Text style={{ color: colors.lightText,fontStyle:'italic',fontSize:14 }}>City: </Text>
                    <Text style={{ color: colors.headerPurple, fontSize,fontWeight:'bold' }} selectable> {city} </Text>
                    </CardSection>
                <CardSection><Text style={{ color: colors.lightText,fontStyle:'italic',fontSize:14 }}>State : </Text>
                    <Text style={{ color: colors.headerPurple, fontSize,fontWeight:'bold' }} selectable> {state} </Text>
                    </CardSection>
            </View>);
    }
    render() {
        return (
            <View style={[styles.card, { alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 5, height: 200, width: SCREEN_WIDTH - 50, margin: 30, marginVertical:10 }]}>
                {this.renderItem()}
                <Button transparent full onPress={this.props.close}>
                    <Text style={{color:colors.headerPurple, fontWeight:'bold'}}> Close </Text>
                </Button>
            </View>
        );
    }
}


export default CompInfo;
