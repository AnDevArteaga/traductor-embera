<template>
  <v-app>
    <!-- Modern app bar with subtle shadow -->
    <v-app-bar app elevation="1" color="white" height="70">
      <div class="d-flex align-center">
        <img src="../assets/TraductorEMBERA.png" height="50" contain class="ml-2" />
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="mr-2"
        elevation="0"
        color="orange darken-3"
        @click="openUserMenu"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn
        icon
        class="mr-4"
        elevation="0"
        color="grey darken-1"
        @click="logout"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main content area with gradient background -->
    <div class="background-gradient">
      <v-main>
        <v-container class="fill-height py-8" fluid>
          <v-row justify="center">
            <!-- Word input form card -->
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-card
                rounded="lg"
                elevation="3"
                class="border-radius-10 overflow-hidden border-top"
              >
                <v-card-title class="orange darken-3 py-4">
                  <v-icon left color="white" class="mr-2">mdi-translate</v-icon>
                  <h3 class="white--text font-weight-medium">Introducir palabras</h3>
                </v-card-title>
                <v-card-text class="px-6 py-5">
                  <v-form @submit.prevent="addWord">
                    <v-text-field
                      v-model="espanol"
                      label="Palabra en español"
                      prepend-inner-icon="mdi-alphabetical"
                      required
                      :error="error"
                      dense
                      outlined
                      class="mb-4"
                    />
                    <v-text-field
                      v-model="embera"
                      label="Traducción en embera"
                      prepend-inner-icon="mdi-book-open-variant"
                      required
                      :error="error"
                      dense
                      outlined
                      class="mb-4"
                    />
                    <v-btn
                      type="submit"
                      color="orange darken-3 white--text"
                      block
                      elevation="1"
                      height="44"
                      class="mb-2"
                    >
                      <v-icon left>mdi-content-save</v-icon>
                      Guardar
                    </v-btn>
                  </v-form>
                  <v-slide-y-transition>
                    <v-alert
                      v-if="message"
                      type="success"
                      text
                      dense
                      class="mt-4"
                    >
                      {{ message }}
                    </v-alert>
                  </v-slide-y-transition>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Words table card -->
            <v-col cols="12" sm="6" md="8" lg="8">
              <v-card
                rounded="lg"
                elevation="3"
                class="border-radius-10 overflow-hidden border-top h-100"
              >
                <v-card-title class="orange darken-3 py-4">
                  <v-icon left color="white" class="mr-2">mdi-dictionary</v-icon>
                  <h3 class="white--text font-weight-medium">Palabras Registradas</h3>
                </v-card-title>
                <v-card-text class="px-0 py-0">
                  <v-data-table
                    :headers="headers"
                    :items="palabras"
                    item-key="id"
                    :footer-props="{
                      'items-per-page-options': [5, 10, 15],
                      'items-per-page-text': 'Palabras por página'
                    }"
                    class="elevation-0"
                  >
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>

    <!-- Footer -->
    <v-footer app color="white" elevation="3" class="px-6 py-3">
      <small class="text-caption grey--text">Traductor Embera © {{ new Date().getFullYear() }}</small>
      <v-spacer></v-spacer>
      <div class="d-flex">
        <v-btn icon x-small class="mx-1" color="grey">
          <v-icon size="16">mdi-help-circle</v-icon>
        </v-btn>
        <v-btn icon x-small class="mx-1" color="grey">
          <v-icon size="16">mdi-information</v-icon>
        </v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      espanol: "",
      embera: "",
      palabras: [],
      headers: [
        { text: "Español", value: "espanol", align: "start" },
        { text: "Embera", value: "embera", align: "start" },
      ],
      error: false,
      message: "",
    };
  },
  created() {
    this.checkSession();
    this.fetchWords();
  },
  methods: {
    // Verificar sesión activa
    checkSession() {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        this.$router.push("/login");
      }
    },
    
    // Cerrar sesión y redirigir al login
    logout() {
      localStorage.removeItem("isLoggedIn");
      this.$router.push("/login");
    },
    
    // Navegar al menú principal
    openUserMenu() {
      this.$router.push("/");
    },
    
    // Agregar nueva palabra al sistema
    addWord() {
      if (!this.espanol || !this.embera) {
        this.error = true;
        return;
      }
      
      const wordData = {
        espanol: this.espanol,
        embera: this.embera,
      };
      
      axios
        .post("https://edutlasdeveloper.pythonanywhere.com/palabras", { paquete: wordData })
        .then((response) => {
          this.message = response.data.msge;
          this.fetchWords();
          this.resetForm();
          setTimeout(() => {
            this.message = "";
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    
    // Obtener palabras registradas
    fetchWords() {
      axios
        .get("https://edutlasdeveloper.pythonanywhere.com/obtener")
        .then((response) => {
          this.palabras = response.data || [];
        })
        .catch((error) => {
          console.error(error);
        });
    },
    
    // Resetear el formulario
    resetForm() {
      this.espanol = "";
      this.embera = "";
      this.error = false;
    },
  },
};
</script>

<style scoped>
.background-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #dfe4ec 100%);
  min-height: 100vh;
}

.border-radius-10 {
  border-radius: 10px !important;
}

.border-top {
  border-top: 4px solid var(--v-primary-base);
}

.search-field :deep(.v-input__slot) {
  min-height: 36px !important;
}

.v-data-table :deep(th) {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.7) !important;
}

.v-data-table :deep(tbody tr:hover) {
  background-color: #f5f5f5 !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>