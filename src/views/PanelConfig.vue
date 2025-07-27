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
                      :type="messageType"
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
                    item-key="espanol"
                    :footer-props="{
                      'items-per-page-options': [5, 10, 15],
                      'items-per-page-text': 'Palabras por página'
                    }"
                    class="elevation-0"
                  >
                    <!-- Slot corregido para las acciones -->
                     <!-- eslint-disable-next-line vue/valid-v-slot -->
                    <template v-slot:item.actions="{ item }">
                      <v-btn 
                        icon 
                        color="red lighten-1" 
                        @click="confirmDelete(item)"
                        :disabled="loading"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>

    <!-- Diálogo de confirmación movido fuera de la tabla -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h6 d-flex align-center">
          <v-icon color="red" class="mr-2">mdi-alert</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text v-if="itemToDelete">
          <p class="mb-2">¿Estás seguro que deseas eliminar esta palabra?</p>
          <p><strong>Español:</strong> {{ itemToDelete.espanol }}</p>
          <p><strong>Embera:</strong> {{ itemToDelete.embera }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            text 
            color="grey darken-1" 
            @click="cancelDelete"
            :disabled="loading"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="red darken-1" 
            text 
            @click="deleteWord"
            :loading="loading"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
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
        { text: "Acciones", value: "actions", sortable: false, align: "center" },
      ],
      error: false,
      message: "",
      messageType: "success",
      dialog: false,
      itemToDelete: null,
      loading: false, // Para controlar el estado de carga
    };
  },
  
  created() {
    this.checkSession();
    this.fetchWords();
  },
  
  methods: {
    // Función para mostrar mensajes y ocultarlos después de un tiempo
    showMessage(text, type = "success", duration = 3000) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
      }, duration);
    },
    
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
        this.showMessage("Por favor completa todos los campos", "error");
        return;
      }
      
      this.loading = true;
      const wordData = {
        espanol: this.espanol.trim(),
        embera: this.embera.trim(),
      };
      
      axios
        .post("https://edutlasdeveloper.pythonanywhere.com/palabras", { paquete: wordData })
        .then((response) => {
          this.showMessage(response.data.msge || "Palabra guardada exitosamente", "success");
          this.fetchWords();
          this.resetForm();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.error || "Ocurrió un error al guardar.";
          this.showMessage(errorMessage, "error");
          console.error("Error al guardar:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // Función para confirmar eliminación
    confirmDelete(item) {
      this.itemToDelete = { ...item }; // Crear una copia del item
      this.dialog = true;
    },
    
    // Función para cancelar eliminación
    cancelDelete() {
      this.dialog = false;
      this.itemToDelete = null;
    },
    
    // Función para eliminar palabra
    deleteWord() {
      if (!this.itemToDelete) {
        console.error("No hay item para eliminar");
        return;
      }
      
      this.loading = true;
      const wordToDelete = this.itemToDelete.espanol;
      
      axios
        .delete(`https://edutlasdeveloper.pythonanywhere.com/palabras/${encodeURIComponent(wordToDelete)}`)
        .then(response => {
          this.showMessage(response.data.msge || "Palabra eliminada exitosamente", "success");
          this.fetchWords(); // Recargar la lista
          this.dialog = false;
          this.itemToDelete = null;
        })
        .catch(error => {
          const errorMessage = error.response?.data?.error || "Error al eliminar la palabra.";
          this.showMessage(errorMessage, "error");
          console.error("Error al eliminar:", error);
        })
        .finally(() => {
          this.loading = false;
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
          console.error("Error al cargar palabras:", error);
          this.showMessage("No se pudieron cargar las palabras.", "error");
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
  border-top: 4px solid #EF6C00; /* Color naranja oscuro */
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