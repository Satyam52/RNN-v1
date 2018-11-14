import { CardSection } from '../components/common';
import React, { Component } from 'react';
import {
    View, TouchableHighlight, Platform, Image, LayoutAnimation,StatusBar, FlatList, AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { realm } from '../realm';
import { Container, Button, Picker, Header, Content, Form, Item, Input, Label, Text, Left, Right, Body, Title, Card, Icon } from 'native-base';
import { styles,colors,QUESTIONS, COMPANIES, PICKER } from '../actions/types';
import LinearGradient from 'react-native-linear-gradient';
import { Spinner } from 'native-base';
let qR = realm.objects(QUESTIONS);
let cR = realm.objects(COMPANIES);
let pickers = realm.objects(PICKER);
let qus = qR.filtered('question="Vendor Company"');
class RecordInfo extends Component {


    static navigatorStyle = {
        navBarHidden: true
    }
    

    componentDidUpdate() {
        Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
    }

    _keyExtractor(ans, index) {
        return index;
    }

    _popComp = (id) => {
        this.props.navigator.showLightBox({
            screen: "CompInfo",
            passProps: {
                id,
                close: () => this.props.navigator.dismissLightBox(),
            },
            style: {
                tapBackgroundToDismiss: true
            }
        });

    }

    editRec = () => {
        this.props.navigator.push({
            screen: 'Edit',
            title: 'Edit Form',
            passProps: {
                uuid:this.props.uuid,
                header: 'Edit Form'
            }
        });
    }

    _renderItem(info) {
        let qusid = qus.length ? qus[0].id : 0;
        if (qR.length) {
            let picker = pickers.filtered('questionId="' + info.item.questionId.toString() + '"');
            if (picker.length) {
                return (
                    <View style={styles.container}>
                        <Text style={styles.textHeader}>{picker[0].question}</Text>
                        <Text style={styles.textInput}>{picker[0].dropdowns.filtered('id="' + info.item.answer + '"')[0].options}</Text>
                    </View>
                )
            }
            else if (qusid == info.item.questionId){
                let company = cR.filtered('id="' + info.item.answer.toString() + '"').length ? cR.filtered('id="' + info.item.answer.toString() + '"')[0].name : 'Company'
                return (
                    <View style={styles.container}>
                        <Text style={styles.textHeader}>{qR.filtered('id="' + info.item.questionId + '"')[0].question}</Text>
                        <Text style={styles.textInput}>{company}</Text> 
                    </View>
                )
            }
            return (
                <View style={styles.container}>
                    <View >
                        <Text style={styles.textHeader}>{qR.filtered('id="' + info.item.questionId + '"')[0].question}</Text>
                        <Text style={styles.textInput}>{info.item.answer}</Text>
                    </View>
                </View>
            )
        }
        else {
            return <Spinner />
        }
    }

    renderFlatlist = () => {
        let ans = this.props.records.filtered('uuid="' + this.props.uuid + '"')[0].answers.sorted('questionId');

        if(this.props.loading){
            return <Spinner/>
        }
        return (
            <View style={styles.card}>
                <FlatList data={ans}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }  

    render() {
       
        
        return (
            <Container>
                <View style={styles.header}>
                    <Left>
                        <Button transparent style={{ padding: 3 }} onPress={() => {
                            this.props.navigator.pop()
                        }}>
                            <Icon name='arrow-dropleft' style={{ color: colors.snow }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: colors.snow }}>Record Info</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.editRec}>
                            <Icon name='md-create' style={{ color: colors.snow }} />
                        </Button>
                    </Right>
                </View>
                <LinearGradient colors={[colors.headerPurple, colors.purple, colors.darkPurple]} style={{ flex: 1 }}>
                    <StatusBar
                        barStyle="light-content"
                    />
                    {this.renderFlatlist()}
                </LinearGradient>
            </Container>
        );
    }
}

const mapStateToProps = ({ getAnswers, getCompanies }) => {
    const loading = getAnswers.loading;
    const records = getAnswers.response;
    return { records, loading };
};

export default connect(mapStateToProps)(RecordInfo);
