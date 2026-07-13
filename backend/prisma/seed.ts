import { PrismaClient, SectionType, QuestionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CHAPTERS = [
  { title: 'Linux', slug: 'linux', icon: 'terminal', order: 1 },
  { title: 'Networking', slug: 'networking', icon: 'network', order: 2 },
  { title: 'Git', slug: 'git', icon: 'git-branch', order: 3 },
  { title: 'Docker', slug: 'docker', icon: 'container', order: 4 },
  { title: 'CI/CD', slug: 'cicd', icon: 'workflow', order: 5 },
  { title: 'Kubernetes', slug: 'kubernetes', icon: 'boxes', order: 6 },
  { title: 'Cloud', slug: 'cloud', icon: 'cloud', order: 7 },
  { title: 'Terraform', slug: 'terraform', icon: 'layers', order: 8 },
  { title: 'Monitoring', slug: 'monitoring', icon: 'activity', order: 9 },
  { title: 'Security', slug: 'security', icon: 'shield', order: 10 },
  { title: 'Linux Project', slug: 'linux-project', icon: 'folder', order: 11 },
  { title: 'Kubernetes Project', slug: 'k8s-project', icon: 'rocket', order: 12 },
  { title: 'DevOps Interview', slug: 'interview', icon: 'message-circle', order: 13 },
];

async function main() {
  console.log('Seeding database...');

  await prisma.quizAttempt.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.userNote.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonSection.deleteMany();
  await prisma.lessonTag.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.oTP.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User123!', 12);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@devops.local',
      password: adminPassword,
      verified: true,
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'user@devops.local',
      password: userPassword,
      verified: true,
      role: 'USER',
      streak: 3,
      studyMinutes: 120,
    },
  });

  const roadmap = await prisma.roadmap.create({
    data: {
      title: 'DevOps Roadmap',
      slug: 'devops',
      description: 'Complete DevOps learning path from Linux basics to production deployments',
      order: 1,
      icon: 'map',
    },
  });

  for (const ch of CHAPTERS) {
    const chapter = await prisma.chapter.create({
      data: {
        roadmapId: roadmap.id,
        title: ch.title,
        slug: ch.slug,
        description: `Learn ${ch.title} fundamentals and best practices`,
        order: ch.order,
        icon: ch.icon,
      },
    });

    if (ch.slug === 'linux') {
      await seedLinuxChapter(chapter.id);
    } else if (ch.slug === 'docker') {
      await seedDockerChapter(chapter.id);
    } else if (ch.slug === 'git') {
      await seedGitChapter(chapter.id);
    } else {
      await prisma.lesson.create({
        data: {
          chapterId: chapter.id,
          title: `Introduction to ${ch.title}`,
          slug: `${ch.slug}-intro`,
          description: `Getting started with ${ch.title}`,
          order: 1,
          duration: 20,
          sections: {
            create: [
              {
                type: SectionType.OVERVIEW,
                title: 'Overview',
                content: `# ${ch.title}\n\nWelcome to the ${ch.title} module. This chapter covers essential concepts every DevOps engineer needs to master.`,
                order: 1,
              },
              {
                type: SectionType.THEORY,
                title: 'Theory',
                content: `## What is ${ch.title}?\n\nThis section will be expanded with detailed content. Start with the Linux, Git, and Docker chapters for full interactive lessons.`,
                order: 2,
              },
            ],
          },
        },
      });
    }

    await prisma.flashcard.createMany({
      data: [
        { chapterId: chapter.id, front: `${ch.title} Basics`, back: `Core concepts of ${ch.title}`, order: 1 },
        { chapterId: chapter.id, front: `${ch.title} Commands`, back: `Essential ${ch.title} commands and tools`, order: 2 },
      ],
    });
  }

  console.log('Seed completed!');
  console.log('Admin: admin@devops.local / Admin123!');
  console.log('User:  user@devops.local / User123!');
}

async function seedLinuxChapter(chapterId: string) {
  const lesson = await prisma.lesson.create({
    data: {
      chapterId,
      title: 'Linux Fundamentals',
      slug: 'linux-fundamentals',
      description: 'Master essential Linux commands and filesystem navigation',
      order: 1,
      duration: 45,
      sections: {
        create: [
          {
            type: SectionType.OVERVIEW,
            title: 'Overview',
            content: `# Linux Fundamentals\n\nLinux is the backbone of modern DevOps infrastructure. From cloud servers to containers, understanding Linux is essential for every DevOps engineer.\n\nIn this lesson, you'll learn:\n- What Linux is and why it matters\n- Navigating the filesystem\n- Essential terminal commands\n- File permissions basics`,
            order: 1,
          },
          {
            type: SectionType.OBJECTIVES,
            title: 'Learning Objectives',
            content: `After completing this lesson, you will be able to:\n\n- Navigate the Linux filesystem using terminal commands\n- Create, copy, move, and delete files and directories\n- Understand the Linux directory structure\n- Use \`man\` pages to find command documentation\n- Execute basic file operations in a simulated terminal`,
            order: 2,
          },
          {
            type: SectionType.THEORY,
            title: 'Theory',
            content: `## What is Linux?\n\nLinux is an open-source Unix-like operating system kernel created by Linus Torvalds in 1991. Today, it powers:\n\n- **90%+ of cloud servers** (AWS, GCP, Azure)\n- **All Android devices**\n- **Docker containers**\n- **Kubernetes nodes**\n\n### Popular Distributions\n\n| Distro | Use Case |\n|--------|----------|\n| Ubuntu | Development, cloud servers |\n| CentOS/RHEL | Enterprise production |\n| Debian | Stable servers |\n| Alpine | Minimal containers |\n\n### The Shell\n\nThe shell is your interface to the OS. Common shells:\n- **bash** — most common default\n- **zsh** — modern alternative\n- **sh** — POSIX standard`,
            order: 3,
          },
          {
            type: SectionType.ARCHITECTURE,
            title: 'Filesystem Architecture',
            content: `## Linux Filesystem Hierarchy\n\n\`\`\`\n/\n├── bin/      # Essential binaries\n├── etc/      # Configuration files\n├── home/     # User home directories\n│   └── user/\n├── var/      # Variable data (logs)\n│   └── log/\n├── tmp/      # Temporary files\n├── usr/      # User programs\n└── opt/      # Optional software\n\`\`\`\n\nEverything in Linux is a **file** — directories, devices, sockets, and pipes.`,
            order: 4,
          },
          {
            type: SectionType.CODE,
            title: 'Essential Commands',
            content: `\`\`\`bash\n# Navigation\npwd          # Print working directory\nls -la       # List all files with details\ncd /home     # Change directory\n\n# File operations\nmkdir project    # Create directory\ntouch app.py     # Create empty file\ncp file.txt backup/   # Copy\nmv old.txt new.txt     # Rename/move\nrm -rf temp/           # Remove directory\n\n# Viewing files\ncat file.txt     # Print contents\nless file.txt    # Paginated view\nhead -n 10 f.log # First 10 lines\ntail -f app.log  # Follow log output\n\`\`\``,
            order: 5,
          },
          {
            type: SectionType.INTERACTIVE,
            title: 'Interactive Terminal',
            content: 'Try these commands in the terminal below',
            order: 6,
            metadata: {
              commands: [
                { input: 'pwd', output: '/home/student' },
                { input: 'mkdir project', output: '' },
                { input: 'cd project', output: '' },
                { input: 'touch app.py README.md', output: '' },
                { input: 'ls -la', output: 'total 8\ndrwxr-xr-x 2 student student 4096 Jul 12 10:00 .\ndrwxr-xr-x 3 student student 4096 Jul 12 10:00 ..\n-rw-r--r-- 1 student student    0 Jul 12 10:00 app.py\n-rw-r--r-- 1 student student    0 Jul 12 10:00 README.md' },
                { input: 'cat README.md', output: '# My Project' },
              ],
            },
          },
          {
            type: SectionType.PRACTICE,
            title: 'Practice',
            content: `## Exercise\n\nCreate the following directory structure:\n\n\`\`\`\nproject/\n├── src/\n│   └── main.py\n├── logs/\n└── backup/\n\`\`\`\n\n**Tasks:**\n1. Create the \`project\` directory\n2. Create subdirectories: \`src\`, \`logs\`, \`backup\`\n3. Create \`main.py\` inside \`src/\`\n4. List the structure with \`tree\` or \`ls -R\``,
            order: 7,
          },
          {
            type: SectionType.SOLUTION,
            title: 'Solution',
            content: `\`\`\`bash\nmkdir -p project/{src,logs,backup}\ntouch project/src/main.py\ntree project/\n# or: ls -R project/\n\`\`\``,
            order: 8,
          },
          {
            type: SectionType.SUMMARY,
            title: 'Summary',
            content: `## Key Takeaways\n\n- Linux filesystem is hierarchical, starting at \`/\`\n- Use \`pwd\`, \`ls\`, \`cd\` for navigation\n- Use \`mkdir\`, \`touch\`, \`cp\`, \`mv\`, \`rm\` for file ops\n- Everything is a file in Linux\n- Practice daily — muscle memory matters!`,
            order: 9,
          },
          {
            type: SectionType.CHEAT_SHEET,
            title: 'Cheat Sheet',
            content: `| Command | Description |\n|---------|-------------|\n| \`pwd\` | Print working directory |\n| \`ls -la\` | List all files |\n| \`cd <dir>\` | Change directory |\n| \`mkdir -p\` | Create nested dirs |\n| \`touch\` | Create empty file |\n| \`cp -r\` | Copy recursively |\n| \`mv\` | Move/rename |\n| \`rm -rf\` | Remove recursively |\n| \`cat\` | View file |\n| \`chmod\` | Change permissions |`,
            order: 10,
          },
        ],
      },
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      lessonId: lesson.id,
      title: 'Linux Fundamentals Quiz',
      description: 'Test your Linux knowledge',
      questions: {
        create: [
          {
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'Which command prints the current working directory?',
            explanation: '`pwd` stands for Print Working Directory',
            order: 1,
            answers: {
              create: [
                { text: 'pwd', isCorrect: true, order: 1 },
                { text: 'ls', isCorrect: false, order: 2 },
                { text: 'cd', isCorrect: false, order: 3 },
                { text: 'dir', isCorrect: false, order: 4 },
              ],
            },
          },
          {
            type: QuestionType.TRUE_FALSE,
            question: 'In Linux, everything is treated as a file.',
            explanation: 'Linux follows the "everything is a file" philosophy',
            order: 2,
            answers: {
              create: [
                { text: 'True', isCorrect: true, order: 1 },
                { text: 'False', isCorrect: false, order: 2 },
              ],
            },
          },
          {
            type: QuestionType.FILL_BLANK,
            question: 'The command to create a new directory is ______',
            explanation: 'mkdir = make directory',
            order: 3,
            answers: {
              create: [{ text: 'mkdir', isCorrect: true, order: 1 }],
            },
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'Which directory contains system configuration files?',
            explanation: '/etc contains host-specific system configuration',
            order: 4,
            answers: {
              create: [
                { text: '/etc', isCorrect: true, order: 1 },
                { text: '/home', isCorrect: false, order: 2 },
                { text: '/tmp', isCorrect: false, order: 3 },
                { text: '/usr', isCorrect: false, order: 4 },
              ],
            },
          },
          {
            type: QuestionType.ORDERING,
            question: 'Order the DevOps workflow steps:',
            explanation: 'Plan → Code → Build → Test → Deploy → Monitor',
            order: 5,
            metadata: {},
            answers: {
              create: [
                { text: 'Plan', isCorrect: true, order: 1 },
                { text: 'Code', isCorrect: true, order: 2 },
                { text: 'Build', isCorrect: true, order: 3 },
                { text: 'Deploy', isCorrect: true, order: 4 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created Linux lesson and quiz: ${quiz.id}`);
}

async function seedDockerChapter(chapterId: string) {
  const lesson = await prisma.lesson.create({
    data: {
      chapterId,
      title: 'Docker Basics',
      slug: 'docker-basics',
      description: 'Learn containerization with Docker',
      order: 1,
      duration: 50,
      sections: {
        create: [
          {
            type: SectionType.OVERVIEW,
            title: 'Overview',
            content: `# Docker Basics\n\nDocker revolutionized how we build, ship, and run applications. Instead of "works on my machine" problems, containers package your app with all dependencies.\n\n**Why Docker?**\n- Consistent environments\n- Fast deployment\n- Resource efficient\n- Microservices ready`,
            order: 1,
          },
          {
            type: SectionType.THEORY,
            title: 'Theory',
            content: `## Containers vs Virtual Machines\n\n| Feature | VM | Container |\n|---------|-----|----------|\n| Startup | Minutes | Seconds |\n| Size | GBs | MBs |\n| Isolation | Full OS | Process level |\n| Overhead | High | Low |\n\n### Docker Architecture\n\n\`\`\`\nDocker Client → Docker Daemon → Containers\n                      ↓\n                   Images\n                      ↓\n                    Registry (Docker Hub)\n\`\`\`\n\n- **Image**: Read-only template\n- **Container**: Running instance of image\n- **Dockerfile**: Recipe to build image\n- **Registry**: Store and share images`,
            order: 2,
          },
          {
            type: SectionType.CODE,
            title: 'Docker Commands',
            content: `\`\`\`bash\n# Images\ndocker pull nginx:latest\ndocker images\ndocker build -t myapp:1.0 .\n\n# Containers\ndocker run -d -p 8080:80 --name web nginx\ndocker ps\ndocker logs web\ndocker exec -it web bash\ndocker stop web && docker rm web\n\n# Cleanup\ndocker system prune -a\n\`\`\``,
            order: 3,
          },
          {
            type: SectionType.INTERACTIVE,
            title: 'Docker Terminal',
            content: 'Practice Docker commands',
            order: 4,
            metadata: {
              commands: [
                { input: 'docker --version', output: 'Docker version 24.0.7, build afdd53b' },
                { input: 'docker pull nginx', output: 'Using default tag: latest\nlatest: Pulling from library/nginx\nStatus: Downloaded newer image for nginx:latest' },
                { input: 'docker run -d -p 8080:80 nginx', output: 'a1b2c3d4e5f6...' },
                { input: 'docker ps', output: 'CONTAINER ID   IMAGE   COMMAND                  STATUS         PORTS                  NAMES\na1b2c3d4e5f6   nginx   "/docker-entrypoint.…"   Up 2 seconds   0.0.0.0:8080->80/tcp   hopeful_curie' },
              ],
            },
          },
          {
            type: SectionType.CHEAT_SHEET,
            title: 'Cheat Sheet',
            content: `| Command | Description |\n|---------|-------------|\n| \`docker build\` | Build image from Dockerfile |\n| \`docker run\` | Create and start container |\n| \`docker ps\` | List running containers |\n| \`docker images\` | List images |\n| \`docker exec\` | Run command in container |\n| \`docker logs\` | View container logs |\n| \`docker compose up\` | Start multi-container app |`,
            order: 5,
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      lessonId: lesson.id,
      title: 'Docker Basics Quiz',
      questions: {
        create: [
          {
            type: QuestionType.TRUE_FALSE,
            question: 'Docker is a type of Virtual Machine.',
            explanation: 'Docker uses containerization, not full virtualization',
            order: 1,
            answers: {
              create: [
                { text: 'True', isCorrect: false, order: 1 },
                { text: 'False', isCorrect: true, order: 2 },
              ],
            },
          },
          {
            type: QuestionType.FILL_BLANK,
            question: 'Docker runs _______ which are lightweight, portable units.',
            explanation: 'Containers package applications with dependencies',
            order: 2,
            answers: {
              create: [{ text: 'containers', isCorrect: true, order: 1 }],
            },
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'Which command lists running containers?',
            explanation: 'docker ps shows running containers',
            order: 3,
            answers: {
              create: [
                { text: 'docker ps', isCorrect: true, order: 1 },
                { text: 'docker list', isCorrect: false, order: 2 },
                { text: 'docker show', isCorrect: false, order: 3 },
                { text: 'docker containers', isCorrect: false, order: 4 },
              ],
            },
          },
          {
            type: QuestionType.DRAG_DROP,
            question: 'Order the CI/CD pipeline:',
            explanation: 'Build → Test → Deploy is the standard flow',
            order: 4,
            metadata: { correctOrder: ['build', 'test', 'deploy'] },
            answers: {
              create: [
                { text: 'Build', isCorrect: true, order: 1, metadata: { id: 'build' } },
                { text: 'Test', isCorrect: true, order: 2, metadata: { id: 'test' } },
                { text: 'Deploy', isCorrect: true, order: 3, metadata: { id: 'deploy' } },
              ],
            },
          },
          {
            type: QuestionType.MATCHING,
            question: 'Match the tool to its purpose:',
            explanation: 'Git=Version Control, Docker=Container, K8s=Orchestration',
            order: 5,
            metadata: {
              pairs: [
                { left: 'Git', right: 'version-control' },
                { left: 'Docker', right: 'container' },
                { left: 'Kubernetes', right: 'orchestration' },
              ],
            },
            answers: {
              create: [
                { text: 'version-control', isCorrect: true, order: 1 },
                { text: 'container', isCorrect: true, order: 2 },
                { text: 'orchestration', isCorrect: true, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
}

async function seedGitChapter(chapterId: string) {
  const lesson = await prisma.lesson.create({
    data: {
      chapterId,
      title: 'Git Essentials',
      slug: 'git-essentials',
      description: 'Version control fundamentals with Git',
      order: 1,
      duration: 40,
      sections: {
        create: [
          {
            type: SectionType.OVERVIEW,
            title: 'Overview',
            content: `# Git Essentials\n\nGit is the most widely used version control system. Every DevOps engineer must master Git for code management, CI/CD pipelines, and collaboration.`,
            order: 1,
          },
          {
            type: SectionType.CODE,
            title: 'Git Commands',
            content: `\`\`\`bash\ngit init\ngit clone https://github.com/user/repo.git\ngit status\ngit add .\ngit commit -m "feat: add new feature"\ngit push origin main\ngit pull\ngit branch feature/login\ngit checkout -b feature/login\ngit merge feature/login\ngit log --oneline\n\`\`\``,
            order: 2,
          },
          {
            type: SectionType.SUMMARY,
            title: 'Summary',
            content: `## Git Workflow\n\n1. **Clone/Pull** latest code\n2. **Branch** for new features\n3. **Commit** changes frequently\n4. **Push** and create PR\n5. **Merge** after review`,
            order: 3,
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      lessonId: lesson.id,
      title: 'Git Essentials Quiz',
      questions: {
        create: [
          {
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'Which command stages all changes?',
            explanation: 'git add . stages all modified files',
            order: 1,
            answers: {
              create: [
                { text: 'git add .', isCorrect: true, order: 1 },
                { text: 'git stage all', isCorrect: false, order: 2 },
                { text: 'git commit -a', isCorrect: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
