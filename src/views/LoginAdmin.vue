<template>
  <v-app id="inspire">
    <!-- Enhanced App Bar with better spacing and shadow -->
    <v-app-bar app color="white" dense elevation="2" height="70">
      <img
        src="../assets/TraductorEMBERA.png"
        height="60"
        contain
        class="ml-2"
      />
      <v-spacer></v-spacer>
      <v-btn icon @click="openUserMenu" class="mr-2">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-app-bar>
    
    <div class="background">
      <v-content>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="10" md="8" lg="7">
              <!-- Enhanced card with smoother elevation and rounded corners -->
              <v-card class="elevation-12 rounded-lg overflow-hidden">
                <v-row no-gutters>
                  <!-- Left side: Login form -->
                  <v-col cols="12" md="7">
                    <v-card-text class="pa-8">
                      <h2 class="text-center orange--text text--darken-3 mb-6 font-weight-bold">
                        Ingresar
                      </h2>

                      <v-form>
                        <v-text-field
                          label="Usuario"
                          name="Usuario"
                          type="text"
                          color="orange darken-3"
                          v-model="username"
                          prepend-inner-icon="mdi-account"
                          outlined
                          dense
                          class="rounded-lg mb-4"
                        />
                        <v-text-field
                          id="password"
                          label="Contraseña"
                          name="Contraseña"
                          :type="showPassword ? 'text' : 'password'"
                          color="orange darken-3"
                          v-model="password"
                          prepend-inner-icon="mdi-lock"
                          append-icon="mdi-eye"
                          @click:append="togglePasswordVisibility"
                          outlined
                          dense
                          class="rounded-lg"
                        />
                      </v-form>
                      
                      <div class="text-center mt-6">
                        <v-btn 
                          rounded 
                          color="orange darken-3" 
                          dark 
                          @click="signIn"
                          elevation="2"
                          x-large
                          class="px-6"
                        >
                          <v-icon left>mdi-login</v-icon>
                          Iniciar Sesión
                        </v-btn>
                      </div>
                      
                      <div v-if="msge" class="mensaje mt-4">
                        <v-icon left small color="white">mdi-alert-circle</v-icon>
                        {{ msge }}
                      </div>
                    </v-card-text>
                  </v-col>
                  
                  <!-- Right side: Welcome banner -->
                  <v-col cols="12" md="5" class="custom-background d-none d-md-flex">

                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      step: 1,
      username: "",
      password: "",
      showPassword: false,
      msge: "", // Mensaje de error
    };
  },
  methods: {
    openUserMenu() {
      this.$router.push('/');
    },

    // Función para manejar el inicio de sesión
    signIn() {
      if (!this.username || !this.password) {
        this.msge = "Por favor ingresa usuario y contraseña";
        setTimeout(() => {
          this.msge = "";
        }, 3000);
        return;
      }
      
      // Hacer la petición POST para verificar las credenciales
      axios
        .post("https://edutlasdeveloper.pythonanywhere.com/api/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          console.log(response);
          // Si la respuesta es "success", redirigir al panel de configuración
          if (response.data.success) {
            localStorage.setItem("isLoggedIn", "true");
            this.$router.push("/panelConfiguracion");
          } else {
            // Si la respuesta es diferente de "success", mostrar mensaje de error
            this.msge = "Credenciales incorrectas";
            setTimeout(() => {
              this.msge = "";
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("Error al realizar el inicio de sesión:", error);
          this.msge = "Credenciales incorrectas";
          setTimeout(() => {
            this.msge = "";
          }, 3000);
        });
    },

    // Función para mostrar u ocultar la contraseña
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Raleway:wght@600&family=Roboto:wght@300;900&family=Source+Code+Pro:wght@400;700&display=swap');

.background {
  background-image: url('../assets/indigena2.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

* {
  font-family: 'Source Code Pro', monospace;
}

h2 {
  font-family: 'Source Code Pro', monospace;
  font-size: 2rem;
  letter-spacing: 1px;
}

.custom-background {
  background: url('../assets/6.png') center center/cover no-repeat;
  position: relative;
}

.welcome-overlay {
  background: rgba(216, 95, 2, 0.5); /* Orange darken-3 with opacity */
  height: 100%;
  width: 100%;
}

@media only screen and (max-width: 768px) {
  .custom-background {
    background: url('../assets/5.png') center center/cover no-repeat;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

.mensaje {
  background-color: rgba(255, 51, 51, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

/* Additional styling */
.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.v-text-field >>> .v-input__slot {
  transition: all 0.3s ease;
}

.v-text-field >>> .v-input__slot:hover {
  border-color: #ef6c00 !important; /* orange darken-3 */
}
</style>