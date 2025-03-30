<template>
  <v-app>
    <!-- Modern app bar -->
    <v-app-bar app elevation="1" color="white" height="70">
      <div class="d-flex align-center">
        <img src="../assets/TraductorEMBERA.png" height="50" contain class="ml-2" />
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="mr-4"
        color="orange darken-3"
        elevation="0"
        @click="openUserMenu"
      >
        <v-icon size="24">mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Language toggle header -->
    <div class="language-bar">
      <div class="language-bar-content">
        <span class="language-label">
          <v-icon color="white" size="18" class="mr-2">mdi-translate</v-icon>
          <strong style="margin-right: 4px;">Lenguas: </strong> Español, Embera
        </span>
      </div>
    </div>

    <!-- Main content area -->
    <v-main class="custom-background">
      <v-container fluid class="pa-6">
        <v-card
          class="translator-card mx-auto"
          elevation="4"
          rounded="lg"
        >
          <v-row class="ma-0">
            <!-- Left column - Source language -->
            <v-col cols="12" md="6" class="pa-6 source-column">
              <v-row>
                <v-col cols="12" md="6" lg="5">
                  <v-select
                    v-model="selectedLanguage1"
                    :items="languages"
                    label="Idioma de origen"
                    outlined
                    dense
                    color="orange darken-3"
                    background-color="white"
                    class="language-select"
                    prepend-inner-icon="mdi-earth"
                  ></v-select>
                </v-col>
              </v-row>
              
              <v-textarea
                v-model="texto"
                placeholder="Escribe aquí el texto a traducir..."
                auto-grow
                outlined
                rows="6"
                row-height="25"
                color="orange darken-3"
                background-color="white"
                hide-details
                class="source-textarea"
              ></v-textarea>
              
              <div class="text-right mt-2">
                <v-btn
                  text
                  small
                  color="grey darken-1"
                  class="ml-4 px-0"
                  @click="texto = '', translate = ''"
                >
                  <v-icon small class="mr-1">mdi-close</v-icon>
                  Limpiar
                </v-btn>
              </div>
            </v-col>
            
            <!-- Divider -->
            <div class="vertical-divider d-none d-md-block"></div>
            
            <!-- Right column - Target language -->
            <v-col cols="12" md="6" class="pa-6 target-column">
              <v-row>
                <v-col cols="12" md="6" lg="5">
                  <v-select
                    v-model="selectedLanguage2"
                    :items="filteredLanguages"
                    label="Idioma de destino"
                    outlined
                    dense
                    color="orange darken-3"
                    background-color="white"
                    class="language-select"
                    prepend-inner-icon="mdi-translate"
                  ></v-select>
                </v-col>
              </v-row>
              
              <v-textarea
                v-model="translate"
                placeholder="Traducción"
                auto-grow
                outlined
                rows="6"
                row-height="25"
                color="orange darken-3"
                background-color="grey lighten-4"
                hide-details
                readonly
                class="target-textarea"
                
              ></v-textarea>

            </v-col>
          </v-row>
          
          <!-- Translate button -->
          <div class="text-center translate-btn-container py-4">
              <LoaderButton :loading="loading" :text="text" @click="traducir" />
          </div>
        </v-card>
        
        <!-- Logos section -->
        <div class="logos-container mt-8">
          <div class="logos-inner">
            <img src="../assets/logoActualizado.jpg" alt="Logo" height="65" class="mx-4" />
            <img src="../assets/lexicon.png" alt="Logo Lexicon" height="65" class="mx-4" />
          </div>
        </div>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app padless color="white" elevation="3" class="px-6 py-2">
      <small class="text-caption grey--text">
        Traductor Embera © {{ new Date().getFullYear() }}
      </small>
      <v-spacer></v-spacer>
      <div class="d-flex">
        <v-btn icon x-small class="mx-1" color="grey darken-1">
          <v-icon size="16">mdi-help-circle</v-icon>
        </v-btn>
        <v-btn icon x-small class="mx-1" color="grey darken-1">
          <v-icon size="16">mdi-information</v-icon>
        </v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import LoaderButton from '@/components/loaderButton.vue';


export default {
  data() {
    return {
      selectedLanguage1: "Español",
      selectedLanguage2: "Embera",
      languages: ["Español", "Embera"],
      texto: "",
      translate: "",
      loading: false,
      text: 'Traducir'
    };

  },
  components: {
      LoaderButton
    },
  computed: {
    // Computada para filtrar el idioma que no se ha seleccionado
    filteredLanguages() {
      return this.languages.filter(lang => lang !== this.selectedLanguage1);
    },
  },
  watch: {
    selectedLanguage1() {
      // Cuando se selecciona un nuevo idioma en el primer select, actualizar el segundo select
      this.selectedLanguage2 = this.filteredLanguages[0];
    },
  },
  methods: {
    // Abrir menú de usuario basado en su sesión
    openUserMenu() {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        this.$router.push('/panelConfiguracion');
      } else {
        this.$router.push('/login');
      }
    },
    // Intercambiar idiomas entre seleccionados
    intercambiarIdiomas() {
      const temp = this.selectedLanguage1;
      this.selectedLanguage1 = this.selectedLanguage2;
      this.selectedLanguage2 = temp;
      const tempTexto = this.texto;
      this.texto = this.translate;
      this.translate = tempTexto;
    },
    // Función para traducir el texto
    traducir() {
      if (!this.texto.trim()) {
        return;
      }
      this.loading = true;
  
      const paquete = {
        idiom1: this.selectedLanguage1,
        idiom2: this.selectedLanguage2,
        texto: this.texto,
        tipo: 'em'
      };
      
      axios
        .post(`https://edutlasdeveloper.pythonanywhere.com/translate`, { paquete })
        .then(response => {
          console.log(response.data);
          this.translate = response.data.translate;
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

* {
  font-family: 'Montserrat', sans-serif;
}

/* Language bar styles */
.language-bar {
  background: linear-gradient(to right, #FF6300, #FF9959);
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: white;
}

.language-bar-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-label {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.language-switch-btn {
  transition: transform 0.2s ease;
}

.language-switch-btn:hover {
  transform: scale(1.1);
}

/* Background styles */
.custom-background {
  background-image:  url('../assets/3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

/* Main translator card */
.translator-card {
  max-width: 1200px;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
  position: relative;
}

/* Language columns */
.source-column, .target-column {
  position: relative;
}

.vertical-divider {
  position: absolute;
  left: 50%;
  top: 60px;
  bottom: 60px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  transform: translateX(-50%);
}

/* Language select dropdown */
.language-select :deep(.v-input__slot) {
  min-height: 44px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

/* Text areas */
.source-textarea :deep(.v-input__slot),
.target-textarea :deep(.v-input__slot) {
  min-height: 180px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgb(255, 166, 0);
}

.target-textarea :deep(.v-input__slot) {
  background-color: #f5f5f5 !important;
}

.target-textarea:focus {
  border: 1px solid rgb(255, 166, 0);
}

/* Translate button styles */
.translate-btn-container {
  position: relative;
  margin-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.translate-btn {
  letter-spacing: 0.5px;
  text-transform: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.translate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 99, 0, 0.3) !important;
}

/* Logos container */
.logos-container {
  position: relative;
  padding: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0));
  border-radius: 16px;
}

.logos-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Responsive styles */
@media (max-width: 960px) {
  .vertical-divider {
    display: none;
  }
  
  .target-column {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 30px !important;
    margin-top: 10px;
  }
}

@media (max-width: 600px) {
  .logos-inner {
    flex-direction: column;
  }
  
  .logos-inner img {
    margin: 10px 0;
  }
  
  .language-bar {
    padding: 0 10px;
  }
  
  .translate-btn {
    width: 90%;
  }
}
</style>