
import { Quill } from 'react-quill-new';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Mention, MentionBlot } from 'quill-mention';

if (typeof window !== "undefined") {

  (window as any).hljs = hljs;

  
  if (!Quill.imports['formats/mention']) {
    Quill.register(MentionBlot);
    Quill.register('modules/mention', Mention);
  }
}
