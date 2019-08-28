<template>
    <div>
        <v-parallax
                height="300"
                src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
        >
            <v-layout
                    align-center
                    column
                    justify-center
            >
                <h1 class="display-2 font-weight-thin mb-3">Твоя вторая
                    память</h1>
            </v-layout>
        </v-parallax>

        <v-container class="show large mt-3">
            <v-layout row>
                <v-flex xs12 sm8 md8>
                    <v-card-text class="desc"><span class="descBold">Твоя вторая память</span>
                        - это современный, удобный, простой в использовании
                        таск-менеджер. Таск-менеджер для всех и каждого. Вместо
                        записной книжки и узелков на память:)
                    </v-card-text>
                </v-flex>
                <v-flex xs12 sm4 md4>
                    <v-img
                            :src="items[0]"
                    />
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-flex xs12 sm4 md4>
                    <v-img
                            :src="items[1]"
                    />
                </v-flex>
                <v-flex xs12 sm8 md8>
                    <v-card-text class="desc descRight">
                        - стабильно работающий,
                        <br>
                        - простой в использовании,
                        <br>
                        - с интуитивно понятным интерфейсом.
                    </v-card-text>
                </v-flex>
            </v-layout>

        </v-container>
        <v-container class="show small mt-3">
            <v-layout row justify-center>
                <v-flex xs10 sm6 md8>
                    <v-card-text  class="desc"><span class="descBold">Твоя вторая память</span>
                        - это современный, удобный, простой в использовании
                        таск-менеджер. Таск-менеджер для всех и каждого. Вместо
                        записной книжки и узелков на память:)
                    </v-card-text>
                </v-flex>
            </v-layout>

            <v-layout row justify-center>
                <v-flex xs10 sm6 md4 >
                    <v-img
                            :src="items[0]"
                    />
                </v-flex>
            </v-layout>
            <v-layout row justify-center>
                <v-flex xs10 sm6 md8>
                    <v-card-text class="desc">
                        - стабильно работающий,
                        <br>
                        - простой в использовании,
                        <br>
                        - с интуитивно понятным интерфейсом.
                    </v-card-text>
                </v-flex>
            </v-layout>
            <v-layout row justify-center>
                <v-flex xs10 sm6 md4>
                    <v-img
                            :src="items[1]"
                    />
                </v-flex>
            </v-layout>
        </v-container>
    </div>

</template>

<script>
  export default {
    data: () => ({
      items: [
        {src: require('@/../static/assets/business.jpg')},
        {src: require('@/../static//assets/travel.jpg')}
      ]
    })
  }
</script>

<style scoped>
    .show {
        font-family: 'Roboto', sans-serif;
        max-width: 1400px;
    }

    .desc {
        font-size: 20px;
        padding-left: 0 !important;
    }

    .descBold {
        font-weight: bold;
    }

    .descRight {
        margin-left: 40px;
    }

    .small {
        display: none;
    }

    @media screen and (max-width: 959px) {
        .large {
            display: none;
        }

        .small {
            display: block;
        }

        .desc {
            font-size: 16px;
            padding-left: 0 !important;
        }
    }

</style>
