// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Create tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // Create an array for tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);

  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent.trim());
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // Create tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();

    // Convert Q&A into an accordion
    const qaContainer = document.createElement('div');
    qaContainer.className = 'accordion-container';

    tabpanel.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (text.startsWith('Q.')) {
        const question = document.createElement('button');
        question.className = 'accordion-question';
        question.innerHTML = text.replace(/^Q\./, '<span>Q.</span>');
        question.setAttribute('aria-expanded', 'false');
        qaContainer.appendChild(question);

        const answerDiv = document.createElement('div');
        answerDiv.className = 'accordion-answer';
        answerDiv.setAttribute('aria-hidden', 'true');
        qaContainer.appendChild(answerDiv);

        question.addEventListener('click', () => {
          const isExpanded = question.getAttribute('aria-expanded') === 'true';

          block.querySelectorAll('.accordion-question').forEach((q) => {
            q.setAttribute('aria-expanded', 'false');
            q.classList.remove('active');
          });

          block.querySelectorAll('.accordion-answer').forEach((a) => {
            a.setAttribute('aria-hidden', 'true');
          });

          if (!isExpanded) {
            question.setAttribute('aria-expanded', 'true');
            question.classList.add('active');
            answerDiv.setAttribute('aria-hidden', 'false');
          }
        });
      }

      if (text.startsWith('A.')) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.innerHTML = p.innerHTML.replace(/^A\./, '<span>A.</span>');
        qaContainer.lastChild.appendChild(wrapperDiv);
      }
    });

    tabpanel.innerHTML = '';
    tabpanel.appendChild(qaContainer);
  });

  block.prepend(tablist);
}
