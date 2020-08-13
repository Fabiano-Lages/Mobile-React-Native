import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import styles from './styles';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';


export interface Teacher {
    id: number,
    nome: string,
    avatar: string,
    assunto: string,
    bio: string,
    custo: number,
    whatsapp: string,
}

interface TeacherItemProps {
    teacher: Teacher,
    favorited: boolean;
}

const TeacherItem:React.FunctionComponent<TeacherItemProps> = ({ teacher, favorited }) => {
    const [isFavorited, setIsFavorited] = useState(favorited);

    function handleWhatsapp() {
        api.post('conections', { 
            user_id: teacher.id 
        });

        let fone = teacher.whatsapp;

        if(fone.indexOf('+') < 0 && fone.substring(0,2) !== '55') {
            fone = '+55' + fone;
        }

        Linking.openURL(`whatsapp://send?phone=${fone}`);
    };

    async function handleToggleFavorite() {
        const favorites = await AsyncStorage.getItem('favorites');
        let favoritesArray = [];

        if(favorites) {
            favoritesArray = JSON.parse(favorites);
        }

        if(isFavorited) {
            favoritesArray = favoritesArray.filter((fv:Teacher) => fv.id !== teacher.id);
        } else {
            favoritesArray.push(teacher);
        }

        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));

        setIsFavorited(!isFavorited);
    }

    return(
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image 
                    style={styles.avatar}
                    source={{uri: teacher.avatar}} 
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.nome}>{teacher.nome}</Text>
                    <Text style={styles.assunto}>{teacher.assunto}</Text>
                </View>
            </View>

            <Text style={styles.bio}>
                {teacher.bio}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.preco}>
                    Preço / hora {'   '}
                    <Text style={styles.valor}>R$ {teacher.custo.toFixed(2)}</Text>
                </Text>
                <View style={styles.buttonsContainer}>
                    <RectButton 
                        style={[
                            styles.favoriteButton, 
                            isFavorited ? styles.favorited : {}
                        ]}
                        onPress={handleToggleFavorite}
                    >
                        {
                            !isFavorited 
                            ? <Image source={heartOutlineIcon} /> 
                            : <Image source={unfavoriteIcon} />
                        }
                    </RectButton>
                    <RectButton style={styles.contactButton} onPress={handleWhatsapp}>
                        <Image source={whatsappIcon} />
                        <Text style={styles.contactButtonText}>
                            Entrar em contato
                        </Text>
                    </RectButton>
                </View>
            </View>
        </View>
    );
}

export default TeacherItem;