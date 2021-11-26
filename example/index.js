const loadUniversalDevToolsJs = async () => {
  const script = document.createElement('script');
  script.src = `http://${window.location.hostname}:9222/script.js`;
  document.body.appendChild(script);
  await new Promise((res) => {
    script.onload = () => res();
  });
};

window.onload = async () => {
  await loadUniversalDevToolsJs();

  const devTools = new window.UnviersalDevTools(
    `ws://${window.location.hostname}:9222`
  );
  devTools.start().then(() => {
    console.log('unviersal devtools is enabled');
  });

  document.getElementById('button0').onclick = console_test;
  document.getElementById('button3').onclick = fetchSomething;

  document.getElementById('consolelog').onclick = () => {
    const value = document.getElementById('log_message').value;
    console.log(value);
  };
  document.getElementById('consolewarn').onclick = () => {
    const value = document.getElementById('warn_message').value;
    console.warn(value);
  };
  document.getElementById('consoleerror').onclick = () => {
    const value = document.getElementById('error_message').value;
    console.error(value);
  };
};

async function fetchSomething() {
  const response = await fetch(
    'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits'
  );
  const commits = await response.json();
  console.log(commits);
}

function console_test() {
  console.log('log test');
  console.info('info test');
  console.error('error test');
  console.warn('warn test');
  console.log('log test ↓');
  console.log(
    1,
    '1',
    true,
    undefined,
    null,
    { a: 1, b: () => [] },
    { a: '1a1' },
    () => {
      console.log(1);
    },
    [1, 2, 3],
    [{ a: 1 }, { b: 'aa', c: { aa: 1 } }, [1, 2, 3]],
    Symbol('synbo'),
    BigInt(11111111111111111)
  );
}
