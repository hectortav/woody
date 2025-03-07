interface Console {
  olog: (arg: any) => void;
  oerror: (arg: any) => void;
  owarn: (arg: any) => void;
  oinfo: (arg: any) => void;
}

interface Window {
  ofetch: typeof fetch;
}
