import React, { useState, useEffect } from "react";

/**
 * Utilitário de formatação para moeda brasileira (BRL)
 */
export const formatBRL = (cents) => {
  const value = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Componente CurrencyInput - Máscara Monetária Real (R$)
 * 
 * Blindado contra erros:
 * - Digitação de centavos progressiva da direita para a esquerda.
 * - Suporte a teclado numérico e mobile (inputMode="numeric").
 * - Sanitização automática contra caracteres não numéricos.
 * - Notifica o componente pai diretamente com valor float (ex: 1250.50).
 */
const CurrencyInput = ({
  value = 0,
  onChange,
  className = "",
  placeholder = "R$ 0,00",
  required = false,
  name = "value",
  disabled = false,
  id,
}) => {
  const parseToCents = (val) => {
    if (val === null || val === undefined || val === "") return 0;
    const num = typeof val === "number" ? val : parseFloat(String(val).replace(",", "."));
    return isNaN(num) ? 0 : Math.round(num * 100);
  };

  const [cents, setCents] = useState(() => parseToCents(value));

  useEffect(() => {
    setCents(parseToCents(value));
  }, [value]);

  const handleChange = (e) => {
    // Extrai apenas dígitos numéricos
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const rawNumber = parseInt(digitsOnly, 10) || 0;

    // Teto de segurança para evitar overflow (até R$ 999.999.999,99)
    const safeCents = Math.min(rawNumber, 99999999999);
    setCents(safeCents);

    const numericValue = safeCents / 100;
    if (onChange) {
      // Fornece um evento sintético compatível com handlers convencionais e valor numérico direto
      onChange({
        target: {
          name,
          value: numericValue,
        },
        numericValue,
        formattedValue: formatBRL(safeCents),
      });
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      id={id}
      name={name}
      required={required}
      disabled={disabled}
      value={formatBRL(cents)}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default CurrencyInput;