/* The report markup, in reading order. Edit the text in pages/*.html. */
import header from './layout/header.html?raw';
import home from './pages/home.html?raw';
import design from './pages/design.html?raw';
import solution from './pages/solution.html?raw';
import implementation from './pages/implementation.html?raw';
import team from './pages/team.html?raw';
import references from './pages/references.html?raw';
import appendices from './pages/appendices.html?raw';
import footer from './layout/footer.html?raw';

export default [header, home, design, solution, implementation, team, references, appendices, footer].join('');
