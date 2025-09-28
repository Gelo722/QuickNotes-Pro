# QuickNotes Pro 📝

Modern, responsive note-taking web application with minimalist design.

## ✨ Features

### 📝 Note Management

- **Create & Edit** - Add new notes and edit existing ones
- **Plain Text** - Clean text without formatting
- **Save on Close** - Data saves when dialog closes

### 🎨 Interface

- **Dark/Light Theme** - Toggle between themes
- **Minimalist Design** - Clean and intuitive interface  
- **Responsive Layout** - Adapts to desktop, tablet, and mobile

### 🔍 Search & Organization

- **Dynamic Search** - Real-time filtering as you type
- **Trash System** - Safe deletion with restore option
- **Export/Import** - Backup notes as JSON files

### 📱 UX Features

- **Mobile Friendly** - Optimized for touch devices
- **Confirmation Dialogs** - Prevent accidental deletions
- **Empty States** - Helpful messages when no notes exist
  


## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Flexbox, CSS Variables
- **Storage**: Browser LocalStorage API
- **Architecture**: Modular approach, SPA

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/QuickNotes-Pro.git
```

2. Open in browser:

```bash
cd QuickNotes-Pro
# Open index.html in your browser
```

No build process required! Works directly in modern browsers.

## 🎮 How to Use

### Creating Notes

1. Click "+ Add Note" button
2. Enter title and content
3. Click "Save Note" or click outside dialog

### Managing Notes

- **Edit**: Click on any note card
- **Delete**: Hover note and click delete icon (desktop) / Always visible (mobile)
- **Search**: Type in search field for instant filtering

### Theme & Settings

- **Toggle Theme**: Click theme icon in header
- **Export Notes**: Use dropdown menu → Export
- **Import Notes**: Use dropdown menu → Import JSON file

## 🏗️ Project Structure

```
QuickNotes-Pro/
├── index.html          # Main HTML file
├── css/
│   ├── style.css       # Main styles
│   └── media.css       # Responsive styles
├── js/
│   ├── app.js          # Application initialization
│   ├── notes-manager.js # Core note logic
│   ├── ui.js           # UI rendering functions
│   ├── storage.js      # localStorage management
│   └── utils.js        # Helper functions
└── README.md
```

## 🔧 Technical Highlights

- **Modular Architecture** - ES6 modules with clear responsibilities
- **SPA Approach** - No page reloads during navigation  
- **Event Delegation** - Efficient handling of dynamic content
- **Responsive Design** - CSS media queries for different screen sizes

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Oleg Arkhangelskii - [GitHub](https://github.com/Gelo722)

---

**QuickNotes Pro** - Organize your thoughts, beautifully. ✨
