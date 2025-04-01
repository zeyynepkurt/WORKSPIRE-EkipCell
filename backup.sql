--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assigned_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assigned_tasks (
    task_id integer NOT NULL,
    employee_id integer,
    manager_id integer,
    task_name character varying(255) NOT NULL,
    task_description text,
    deadline date,
    score integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_completed boolean DEFAULT false
);


ALTER TABLE public.assigned_tasks OWNER TO postgres;

--
-- Name: assigned_tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assigned_tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assigned_tasks_task_id_seq OWNER TO postgres;

--
-- Name: assigned_tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assigned_tasks_task_id_seq OWNED BY public.assigned_tasks.task_id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    department character varying(100) NOT NULL,
    manager_id integer,
    phone_number character varying(20),
    photo_url text,
    salary numeric DEFAULT 0 NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_employee_id_seq OWNER TO postgres;

--
-- Name: employees_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_employee_id_seq OWNED BY public.employees.employee_id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    username character varying(100),
    content text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.todos (
    todo_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    is_completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.todos OWNER TO postgres;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todos_todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todos_todo_id_seq OWNER TO postgres;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todos_todo_id_seq OWNED BY public.todos.todo_id;


--
-- Name: work_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_sessions (
    session_id integer NOT NULL,
    employee_id integer NOT NULL,
    minutes integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.work_sessions OWNER TO postgres;

--
-- Name: work_sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.work_sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_sessions_session_id_seq OWNER TO postgres;

--
-- Name: work_sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.work_sessions_session_id_seq OWNED BY public.work_sessions.session_id;


--
-- Name: assigned_tasks task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tasks ALTER COLUMN task_id SET DEFAULT nextval('public.assigned_tasks_task_id_seq'::regclass);


--
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: todos todo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos ALTER COLUMN todo_id SET DEFAULT nextval('public.todos_todo_id_seq'::regclass);


--
-- Name: work_sessions session_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions ALTER COLUMN session_id SET DEFAULT nextval('public.work_sessions_session_id_seq'::regclass);


--
-- Data for Name: assigned_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assigned_tasks (task_id, employee_id, manager_id, task_name, task_description, deadline, score, created_at, is_completed) FROM stdin;
2	7	2	qqqqqqqq	qqqqqqq	2025-03-30	44	2025-03-24 23:48:30.177088	f
1	5	2	wdw	qwdqwed	2025-03-08	23	2025-03-24 23:33:33.802566	f
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (employee_id, name, email, password, department, manager_id, phone_number, photo_url, salary) FROM stdin;
3	Zeynep Kaya	zeynep@example.com	$2b$10$n6Tpc6FAjRQsnxA6weJoO.RsxmXr51sBJH8U5ft0TZvwbUz/xzHyy	HR-1	1	+905222222222	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-1.jpg\n	0
5	Zeynep Deniz	zeynep1@example.com	$2b$10$gEiD8IzjEC6e7g7EPhGvouaIsQP3b4BB57ajahFC6xK6hQYYQl/k.	IT-1	2	+905444444444	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-5.jpg\n	0
6	Ali Usta	ali@example.com	$2b$10$tIaHAs5TH7j9yWM7UTJhqeO7LruOYnu6B6RpFpP.MVNEWRxLGIAQC	IT-1	2	+905555555555	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-7.jpg	0
4	Ay┼şe Kaya	ayse@example.com	$2b$10$W/ltlWENl94iH9PKN/Ce6uIe2wt471nR/iEfSCW11RczBBlXxEzGe	IT-1	2	+905333333333	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-4.jpg\n	0
2	Mehmet Y─▒lmaz	mehmet@example.com	$2b$10$62d2rVIvlBK14HIJAnU4mOdHZEbFGD5xDKu96zNdGGU0gkRrJZTha	IT-1	1	+905111111111	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-2.jpg\n	0
7	Damla Can	damla@example.com	$2b$10$1lf0kHYJ0EOKloPRt06wQ.nc1fu0pANfHXG3oIy7Pp9Pj5yZFBLgK	IT-1	2	+905666666666	https://img.freepik.com/premium-photo/face-young-woman-face-white-background-generative-ai_849906-20048.jpg?w=996	0
1	Ahmet Demir	ahmet@example.com	$2b$10$b.rvhzVwd1EYx0eZJXEL5umRmMHNr7baLBwUIKFaQ0w5HcCANp2Eq	Manager	\N	+9005000000000	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-2.jpg\n	0
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, username, content, "timestamp") FROM stdin;
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todos (todo_id, user_id, title, description, is_completed, created_at) FROM stdin;
11	5	wawaraw	\N	f	2025-03-25 02:10:05.554615
12	5	rghfgfd	\N	f	2025-03-25 02:10:12.117838
13	5	yuguyhgbhj	\N	f	2025-03-25 02:15:23.316236
14	2	fhgh	\N	f	2025-04-01 11:28:20.40645
15	2	dhj	\N	f	2025-04-01 11:28:22.659855
16	2	dfg	\N	f	2025-04-01 11:28:33.87021
\.


--
-- Data for Name: work_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_sessions (session_id, employee_id, minutes, created_at) FROM stdin;
1	3	0	2025-04-01 10:24:54.016352
2	5	0	2025-04-01 10:24:54.016352
3	6	0	2025-04-01 10:24:54.016352
4	4	0	2025-04-01 10:24:54.016352
6	7	0	2025-04-01 10:24:54.016352
7	1	0	2025-04-01 10:24:54.016352
5	2	3	2025-04-01 10:24:54.016352
\.


--
-- Name: assigned_tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assigned_tasks_task_id_seq', 2, true);


--
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_employee_id_seq', 3, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: todos_todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todos_todo_id_seq', 16, true);


--
-- Name: work_sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_sessions_session_id_seq', 9, true);


--
-- Name: assigned_tasks assigned_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tasks
    ADD CONSTRAINT assigned_tasks_pkey PRIMARY KEY (task_id);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (todo_id);


--
-- Name: work_sessions work_sessions_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_employee_id_key UNIQUE (employee_id);


--
-- Name: work_sessions work_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_sessions
    ADD CONSTRAINT work_sessions_pkey PRIMARY KEY (session_id);


--
-- Name: assigned_tasks assigned_tasks_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tasks
    ADD CONSTRAINT assigned_tasks_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- Name: employees employees_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(employee_id);


--
-- Name: todos todos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

