const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Esquema de GraphQL
const schema = buildSchema(`
  type Cita {
    id: ID!
    nombreCliente: String!
    fecha: String!
    hora: String!
  }

  type Query {
    obtenerCitas: [Cita]
    obtenerCita(id: ID!): Cita
  }

  type Mutation {
    agregarCita(nombreCliente: String!, fecha: String!, hora: String!): Cita
    modificarCita(id: ID!, nombreCliente: String, fecha: String, hora: String): Cita
    eliminarCita(id: ID!): String
  }
`);

// Datos en memoria (como base de datos temporal)
const citas = [];
let idCounter = 1;

// Resolvers
const root = {
  obtenerCitas: () => citas,
  obtenerCita: ({ id }) => citas.find(cita => cita.id === id),
  agregarCita: ({ nombreCliente, fecha, hora }) => {
    const nuevaCita = { id: idCounter.toString(), nombreCliente, fecha, hora };
    citas.push(nuevaCita);
    idCounter++;
    return nuevaCita;
  },
  modificarCita: ({ id, nombreCliente, fecha, hora }) => {
    const cita = citas.find(cita => cita.id === id);
    if (!cita) throw new Error('Cita no encontrada');
    if (nombreCliente) cita.nombreCliente = nombreCliente;
    if (fecha) cita.fecha = fecha;
    if (hora) cita.hora = hora;
    return cita;
  },
  eliminarCita: ({ id }) => {
    const index = citas.findIndex(cita => cita.id === id);
    if (index === -1) throw new Error('Cita no encontrada');
    citas.splice(index, 1);
    return 'Cita eliminada exitosamente';
  },
};

// Configuración del servidor
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}/graphql`);
});
