import { useEffect, useState } from 'react';
import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import api from '../../services/api';
import { FoodsContainer } from './styles';

export type FoodModel = {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
};

export type AddFood = Omit<FoodModel, 'id' | 'available'>;

function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [foods, setFoods] = useState<FoodModel[]>([]);
  const [editingFood, setEditingFood] = useState<FoodModel>({} as FoodModel);

  useEffect(() => {
    api.get<FoodModel[]>('/foods').then(({ data }) => setFoods(data));
  }, []);

  const toggleAddModal = () => setIsAddModalOpen((isOpen) => !isOpen);

  const toggleEditModal = () => setIsEditModalOpen((isOpen) => !isOpen);

  const handleAddFood = async (food: AddFood) => {
    try {
      const { data } = await api.post<FoodModel>('/foods', {
        ...food,
        available: true,
      });

      setFoods((prevFoods) => [...prevFoods, data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodModel) => {
    try {
      const { data: foodUpdated } = await api.put<FoodModel>(
        `/foods/${editingFood.id}`,
        {
          ...editingFood,
          ...food,
        }
      );

      setFoods((foods) =>
        foods.map((food) => (food.id !== foodUpdated.id ? food : foodUpdated))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);
    setFoods((foods) => foods.filter((food) => food.id !== id));
  };

  const handleEditFood = async (food: FoodModel) => {
    setEditingFood(food);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleAddModal} />
      <ModalAddFood
        isOpen={isAddModalOpen}
        setIsOpen={toggleAddModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods.map((food) => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
