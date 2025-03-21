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
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (employee_id, name, email, password, department, manager_id, phone_number, photo_url, salary) FROM stdin;
3	Zeynep Kaya	zeynep@example.com	$2b$10$n6Tpc6FAjRQsnxA6weJoO.RsxmXr51sBJH8U5ft0TZvwbUz/xzHyy	HR-1	1	+905222222222	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-1.jpg\n	0
5	Zeynep Deniz	zeynep1@example.com	$2b$10$gEiD8IzjEC6e7g7EPhGvouaIsQP3b4BB57ajahFC6xK6hQYYQl/k.	IT-1	2	+905444444444	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-5.jpg\n	0
6	Ali Usta	ali@example.com	$2b$10$tIaHAs5TH7j9yWM7UTJhqeO7LruOYnu6B6RpFpP.MVNEWRxLGIAQC	IT-1	2	+905555555555	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-7.jpg	0
4	Ayşe Kaya	ayse@example.com	$2b$10$W/ltlWENl94iH9PKN/Ce6uIe2wt471nR/iEfSCW11RczBBlXxEzGe	IT-1	2	+905333333333	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-4.jpg\n	0
2	Mehmet Yılmaz	mehmet@example.com	$2b$10$62d2rVIvlBK14HIJAnU4mOdHZEbFGD5xDKu96zNdGGU0gkRrJZTha	IT-1	1	+905111111111	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-2.jpg\n	0
7	Damla Can	damla@example.com	$2b$10$1lf0kHYJ0EOKloPRt06wQ.nc1fu0pANfHXG3oIy7Pp9Pj5yZFBLgK	IT-1	2	+905666666666	https://img.freepik.com/premium-photo/face-young-woman-face-white-background-generative-ai_849906-20048.jpg?w=996	0
1	Ahmet Demir	ahmet@example.com	$2b$10$b.rvhzVwd1EYx0eZJXEL5umRmMHNr7baLBwUIKFaQ0w5HcCANp2Eq	Manager	\N	+9005000000000	https://www.profilebakery.com/wp-content/uploads/2023/04/ai-professional-headshot-2.jpg\n	0
\.


--
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_employee_id_seq', 3, true);


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
-- Name: employees employees_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(employee_id);


--
-- PostgreSQL database dump complete
--

