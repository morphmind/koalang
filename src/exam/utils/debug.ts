// Debug levels
export type DebugLevel = 'info' | 'warn' | 'error';

// Debug configuration
const DEBUG_CONFIG = {
  enabled: true,
  prefix: '[Quiz Debug]',
  colors: {
    info: '#375AF8',
    warn: '#FFA500', 
    error: '#FF0000'
  }
};

// Debug function
export function debug(message: string, level: DebugLevel = 'info', data?: any) {
  if (!DEBUG_CONFIG.enabled) return;

  const timestamp = new Date().toISOString();
  const prefix = `${DEBUG_CONFIG.prefix} [${timestamp}]`;
  
  const style = `color: ${DEBUG_CONFIG.colors[level]}; font-weight: bold;`;

  console.group(prefix);
  console.log(`%c${message}`, style);
  if (data) {
    console.log('Data:', data);
  }
  console.groupEnd();

  // Error durumunda React DevTools'a da bildirim gönder
  if (level === 'error') {
    console.trace('Error Stack Trace:');
  }
}

// State değişikliklerini izleme
export function logStateChange(action: string, prevState: any, nextState: any) {
  debug(
    `State Change: ${action}`,
    'info',
    {
      prev: prevState,
      next: nextState,
      changes: findStateChanges(prevState, nextState)
    }
  );
}

// İki state arasındaki farkları bulma
function findStateChanges(prev: any, next: any) {
  const changes: {[key: string]: {prev: any, next: any}} = {};
  
  Object.keys({...prev, ...next}).forEach(key => {
    if (prev[key] !== next[key]) {
      changes[key] = {
        prev: prev[key],
        next: next[key]
      };
    }
  });
  
  return changes;
}