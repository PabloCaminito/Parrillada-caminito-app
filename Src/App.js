// Función para cargar reservas por fecha
async function cargarReservas(fecha) {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('fecha', fecha)
    .order('hora', { ascending: true });

  const agendaDiv = document.getElementById('agenda');
  agendaDiv.innerHTML = '';

  if (error) {
    agendaDiv.innerHTML = `<p style="color:red">Error al cargar reservas: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    agendaDiv.innerHTML = '<p>No hay reservas para esta fecha</p>';
    return;
  }

  mostrarAgenda(data, fecha);
}

// Función para mostrar agenda organizada por mesas
function mostrarAgenda(reservas, fecha) {
  const agendaDiv = document.getElementById('agenda');
  
  // Definimos mesas y capacidades
  const mesas = [
    { id: 1, capacidad: 4 },
    { id: 2, capacidad: 8 },
    { id: 3, capacidad: 8 },
    { id: 4, capacidad: 2 },
    { id: 5, capacidad: 2 },
    { id: 6, capacidad: 4 },
    { id: 7, capacidad: 4 },
    { id: 8, capacidad: 4 },
    { id: 9, capacidad: 11 },
    { id: 31, capacidad: 4 },
    { id: 32, capacidad: 4 },
    { id: 33, capacidad: 15 },
    { id: 34, capacidad: 16 }
  ];

  mesas.forEach(mesa => {
    const reservasMesa = reservas.filter(r => asignarMesa(r.personas) === mesa.id);
    const div = document.createElement('div');
    div.className = 'mesa';
    if (mesa.capacidad > 10) div.classList.add('reserva-grande');

    div.innerHTML = `<strong>Mesa ${mesa.id} (capacidad: ${mesa.capacidad})</strong><br/>`;

    if (reservasMesa.length === 0) {
      div.innerHTML += 'Sin reservas';
    } else {
      reservasMesa.forEach(r => {
        div.innerHTML += `${r.hora} - ${r.nombre} - ${r.personas} personas<br/>`;
      });
    }

    agendaDiv.appendChild(div);
  });
}

// Función para asignar mesa según número de personas
function asignarMesa(personas) {
  if (personas <= 2) return 4; // Mesa 4 o 5 se puede alternar
  if (personas <= 4) return 1; // Mesa 1, 6, 7, 8
  if (personas <= 8) return 2; // Mesa 2 o 3
  if (personas <= 11) return 9;
  if (personas <= 15) return 33;
  if (personas <= 16) return 34;
  return 34; // Más de 16 asignamos a la mesa grande
}

// Manejo del formulario para guardar reservas
document.getElementById('formReserva').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const personas = parseInt(document.getElementById('personas').value);
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;

  const { data, error } = await supabase.from('reservas').insert([
    { nombre, telefono, personas, fecha, hora }
  ]);

  if (error) {
    alert('Error al guardar reserva: ' + error.message);
  } else {
    alert('Reserva guardada correctamente');
    // Limpiar formulario
    document.getElementById('formReserva').reset();
  }
});
