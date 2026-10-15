export const soloDigitos = (texto) => String(texto ?? '').replace(/\D/g, '');

export const formatearTelefono = (texto) => {
  const digitos = soloDigitos(texto);
  if (!digitos) return '';
  const prefijo = digitos.slice(0, 4);
  const resto = digitos.slice(4);
  return resto ? `(${prefijo}) - ${resto}` : `(${prefijo}`;
};
