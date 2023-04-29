<!DOCTYPE html>
<html>
<head>
  <title>Calculator</title>
  <style>
    .calculator {
      width: 200px;
      padding: 10px;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <div class="calculator">
    <input type="text" id="result" disabled>
    <table>
      <tr>
        <td><button onclick="appendNumber(7)">7</button></td>
        <td><button onclick="appendNumber(8)">8</button></td>
        <td><button onclick="appendNumber(9)">9</button></td>
        <td><button onclick="appendOperator('+')">+</button></td>
      </tr>
      <tr>
        <td><button onclick="appendNumber(4)">4</button></td>
        <td><button onclick="appendNumber(5)">5</button></td>
        <td><button onclick="appendNumber(6)">6</button></td>
        <td><button onclick="appendOperator('-')">-</button></td>
      </tr>
      <tr>
        <td><button onclick="appendNumber(1)">1</button></td>
        <td><button onclick="appendNumber(2)">2</button></td>
        <td><button onclick="appendNumber(3)">3</button></td>
        <td><button onclick="appendOperator('*')">*</button></td>
      </tr>
      <tr>
        <td><button onclick="appendNumber(0)">0</button></td>
        <td><button onclick="appendOperator('.')">.</button></td>
        <td><button onclick="calculate()">=</button></td>
        <td><button onclick="appendOperator('/')">/</button></td>
      </tr>
      <tr>
        <td colspan="4"><button onclick="clearResult()">Clear</button></td>
      </tr>
    </table>
  </div>

  <script>
    let resultElement = document.getElementById('result');
    let expression = '';

    function appendNumber(number) {
      expression += number;
      resultElement.value = expression;
    }

    function appendOperator(operator) {
      expression += operator;
      resultElement.value = expression;
    }

    function calculate() {
      try {
        let result = eval(expression);
        resultElement.value = result;
        expression = '';
      } catch (error) {
        resultElement.value = 'Error';
      }
    }

    function clearResult() {
      expression = '';
      resultElement.value = '';
    }
  </script>
</body>
</html>
